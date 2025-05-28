package com.se330.ctuong_backend.service.engine;

import com.se330.xiangqi.Move;
import lombok.*;

import java.io.*;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static java.util.concurrent.CompletableFuture.supplyAsync;

public class FairyStockFishEngine {
    protected BufferedReader engineOutput;
    protected OutputStreamWriter engineInput;
    protected Process process;
    protected String engineName;

    private static final Integer MAX_STRENGTH = 20;
    private static final Integer MIN_STRENGTH = -20;

    @Getter
    private boolean isRunning = false;

    protected FairyStockFishEngine(String name) {
        engineName = name;
    }

    public <T> T runCommand(String command, Function<List<String>, T> commandProcessor, Predicate<String> breakCondition) throws ExecutionException, InterruptedException, TimeoutException {
        return runCommand(command, commandProcessor, breakCondition, 5000);
    }

    public <T> T runCommand(String command, Function<List<String>, T> commandProcessor, Predicate<String> breakCondition, long timeout) throws ExecutionException, InterruptedException, TimeoutException {
        CompletableFuture<T> result = supplyAsync(() -> {
            final List<String> output = new ArrayList<>();
            try {
                engineInput.flush();
                engineInput.write(command + "\n"); // Write the actual command
                engineInput.flush();

                String line;
                while ((line = engineOutput.readLine()) != null) {
                    if (line.contains("Unknown command")) {
                        throw new RuntimeException(line);
                    }
                    if (line.contains("Unexpected token")) {
                        throw new RuntimeException("Unexpected token: " + line);
                    }
                    output.add(line);
                    if (breakCondition.test(line)) {
                        break;
                    }
                }
            } catch (IOException e) {
                e.printStackTrace(); // Consider more robust error handling
            }
            return commandProcessor.apply(output);
        });

        return result.get(timeout, TimeUnit.MILLISECONDS);
    }

    public void exit() {
        runReturnlessCommand("exit");
        if (process != null && process.isAlive()) {
            process.destroy();
        }

        try {
            if (engineOutput != null) {
                engineOutput.close();
            }
            if (engineInput != null) {
                engineInput.close();
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to close engine streams", e);
        }
    }

    public void start() {
        try {
            ProcessBuilder processBuilder = new ProcessBuilder(engineName);
            processBuilder.redirectErrorStream(true);
            this.process = processBuilder.start(); // Assign to class member 'this.process'
            this.engineOutput = new BufferedReader(new InputStreamReader(process.getInputStream()));
            this.engineInput = new OutputStreamWriter(process.getOutputStream());
            isRunning = true;

            // Use runCommand for "uci" and expect "uciok"
            String uciResult = runCommand("uci",
                    lines -> String.join("\n", lines), // Process to a single string
                    line -> line.contains("uciok") // Break condition
            );
            if (!uciResult.contains("uciok")) {
                throw new RuntimeException("Failed to start Fairy Stockfish engine: " + uciResult);
            }
            runReturnlessCommand("setoption name UCI_Variant value xiangqi");

            if (!isReady()) {
                throw new RuntimeException("Fairy Stockfish engine is not ready after starting.");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to start Fairy Stockfish engine", e);
        }
    }

    public static FairyStockFishEngine withEngine(String name) {
        if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("Engine path cannot be null or empty");
        }
        return new FairyStockFishEngine(name);
    }

    public static FairyStockFishEngine withDefaults() {
        return new FairyStockFishEngine("fairy-stockfish");
    }

    public boolean isReady() {
        if (!isRunning()) {
            return false;
        }

        // Use runCommand for "isready" and expect "readyok"
        try {
            String response = runCommand("isready",
                    lines -> String.join("\n", lines), // Process to a single string
                    line -> line.contains("readyok") // Break condition
            );
            return response.contains("readyok");
        } catch (ExecutionException | InterruptedException | TimeoutException e) {
            throw new RuntimeException("Failed to check if engine is ready", e);
        }
    }

    public void runReturnlessCommand(String command) {
        if (!isRunning) {
            throw new RuntimeException("Fairy Stockfish engine is not running.");
        }
        if (!isReady()) {
            throw new RuntimeException("Fairy Stockfish engine is not ready.");
        }
        command += "\nisready\n"; // Ensure command ends with newline

        try {
            // Use runCommand for commands that do not require a return value
            runCommand(command,
                    lines -> null, // No specific return needed
                    line -> line.contains("readyok")
            );
        } catch (ExecutionException | InterruptedException | TimeoutException e) {
            throw new RuntimeException("Failed to execute command: " + command, e);
        }
    }

    public void reset() {
        // Implement reset logic if needed, e.g., runCommand("ucinewgame", ...)
    }

    public Move generateMove(MoveGenerationArgs args) {
        if (!isRunning) {
            throw new RuntimeException("Fairy Stockfish engine is not running.");
        }
        if (!isReady()) {
            throw new RuntimeException("Fairy Stockfish engine is not ready.");
        }

        try {
            // Set the board position
            String setPositionCommand;
            if (args.getFen() == null || args.getFen().isEmpty()) {
                setPositionCommand = "position startpos";
            } else {
                setPositionCommand = "position fen " + args.getFen();
            }

            runReturnlessCommand(setPositionCommand);

            // Set engine strength (Skill Level) if provided
            String setStrengthCommand;
            if (args.getStrength() >= MIN_STRENGTH && args.getStrength() <= MAX_STRENGTH) {
                setStrengthCommand = "setoption name Skill Level value " + args.getStrength();
            } else if (args.getStrength() > MAX_STRENGTH) {
                setStrengthCommand = "setoption name Skill Level value " + MAX_STRENGTH;
            } else {
                setStrengthCommand = "setoption name Skill Level value " + MIN_STRENGTH;
            }

            runReturnlessCommand(setStrengthCommand);

            // Construct the "go" command based on time controls
            StringBuilder goCommandBuilder = new StringBuilder("go");
            if (args.getWhiteTimeLeft() != null && args.getBlackTimeLeft() != null) {
                goCommandBuilder
                        .append(" wtime ").append(args.getWhiteTimeLeft().toMillis())
                        .append(" btime ").append(args.getBlackTimeLeft().toMillis());
            }

            String goCommand = goCommandBuilder.toString();
            // Use runCommand for "go" and specifically wait for "bestmove"
            String response = runCommand(goCommand,
                    lines -> String.join("\n", lines), // Process all lines into a single string
                    line -> line.startsWith("bestmove"),// Break condition for bestmove
                    99999999L
            );

            // Parse the "bestmove" from the engine's response
            Pattern pattern = Pattern.compile("bestmove (\\S+)");
            Matcher matcher = pattern.matcher(response);
            if (matcher.find()) {
                String bestMoveUci = matcher.group(1);
                if (bestMoveUci.contains(" ")) {
                    bestMoveUci = bestMoveUci.split(" ")[0];
                }
                return Move.fromUci(bestMoveUci);
            } else {
                throw new RuntimeException("Failed to parse bestmove from engine output:\n" + response);
            }
        } catch (ExecutionException | InterruptedException | TimeoutException e) {
            throw new RuntimeException("Failed to generate move due to engine communication error", e);
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MoveGenerationArgs {
        private String fen;
        private int strength;
        private Duration blackTimeLeft;
        private Duration whiteTimeLeft;
    }
}