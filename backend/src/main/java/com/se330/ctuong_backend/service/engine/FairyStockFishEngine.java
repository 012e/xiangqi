package com.se330.ctuong_backend.service.engine;

import com.se330.xiangqi.Move;
import lombok.*;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.time.Duration;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class FairyStockFishEngine {
    protected BufferedReader engineOutput;
    protected BufferedWriter engineInput;
    protected Process process;
    protected String engineName;

    private static final Integer MAX_STRENGTH = 20;
    private static final Integer MIN_STRENGTH = -20;

    @Getter
    private boolean isRunning = false;


    protected FairyStockFishEngine(String name) {
        engineName = name;
    }

    public String runCommandSync(String command) {
        try {
            engineInput.write(command);
            engineInput.newLine();
            engineInput.flush();
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = engineOutput.readLine()) != null && !line.isEmpty()) {
                response.append(line).append("\n");
            }
            return response.toString().trim();
        } catch (Exception e) {
            throw new RuntimeException("Failed to run command: " + command, e);
        }
    }

    public void exit() {
        process.destroy();
    }

    public void start() {
        try {
            ProcessBuilder processBuilder = new ProcessBuilder(engineName);
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();
            this.engineOutput = new BufferedReader(new InputStreamReader(process.getInputStream()));
            this.engineInput = new BufferedWriter(new PrintWriter(process.getOutputStream()));
            isRunning = true;
            String result = runCommandSync("uci");
            if (!result.contains("uciok")) {
                throw new RuntimeException("Failed to start Fairy Stockfish engine: " + result);
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

        String response = runCommandSync("isready");
        return response.contains("readyok");
    }

    public void reset() {
    }

    public Move generateMove(MoveGenerationArgs args) {
        if (!isRunning) {
            throw new RuntimeException("Fairy Stockfish engine is not running.");
        }
        if (!isReady()) {
            throw new RuntimeException("Fairy Stockfish engine is not ready.");
        }

        // Set the board position
        String setPositionCommand;
        if (args.getFen() == null || args.getFen().isEmpty()) {
            setPositionCommand = "position startpos";
        } else {
            setPositionCommand = "position fen " + args.getFen();
        }
        runCommandSync(setPositionCommand);

        // Set engine strength (Skill Level) if provided
        // Stockfish's Skill Level goes from 0 to 20. Map your 'strength' to this range.
        // Assuming args.strength is 1-10, we can map it to 0-20.
        if (args.getStrength() >= MIN_STRENGTH && args.getStrength() <= MAX_STRENGTH) { // Assuming strength is directly Stockfish skill level
            runCommandSync("setoption name Skill Level value " + args.getStrength());
        } else if (args.getStrength() > MAX_STRENGTH) {
            runCommandSync("setoption name Skill Level value " + MAX_STRENGTH); // Max skill level
        } else {
            runCommandSync("setoption name Skill Level value " + MIN_STRENGTH); // Min skill level
        }


        // Construct the "go" command based on time controls
        StringBuilder goCommandBuilder = new StringBuilder("go");
        if (args.getWhiteTimeLeft() != null && args.getBlackTimeLeft() != null) {
            goCommandBuilder
                    .append(" wtime ").append(args.getWhiteTimeLeft().toMillis())
                    .append(" btime ").append(args.getBlackTimeLeft().toMillis());
            // You can also add `winc` and `binc` (increment) if you have them in MoveGenerationArgs
        }

        String goCommand = goCommandBuilder.toString();
        String response = runCommandSync(goCommand);

        // Parse the "bestmove" from the engine's response
        Pattern pattern = Pattern.compile("bestmove (\\S+)");
        Matcher matcher = pattern.matcher(response);
        if (matcher.find()) {
            String bestMoveUci = matcher.group(1);
            // Stockfish sometimes includes "ponder" move, we only need the best move
            if (bestMoveUci.contains(" ")) {
                bestMoveUci = bestMoveUci.split(" ")[0];
            }
            return Move.fromUci(bestMoveUci);
        } else {
            throw new RuntimeException("Failed to parse bestmove from engine output:\n" + response);
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public class MoveGenerationArgs {
        private String fen;
        private int strength;
        private Duration blackTimeLeft;
        private Duration whiteTimeLeft;
    }
}
