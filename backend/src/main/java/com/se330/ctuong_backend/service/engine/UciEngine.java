package com.se330.ctuong_backend.service.engine;


import lombok.extern.slf4j.Slf4j;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;

/**
 * An abstract base class for a UCI (Universal Chess Interface) compatible chess engine.
 * This class provides default implementations for common UCI commands and handles
 * the communication loop with a GUI.
 *
 * Subclasses must implement the 'go' method for move searching and 'isReady' for engine readiness.
 * They can also override other methods to customize behavior.
 */
@Slf4j
public abstract class UciEngine {
    protected BufferedReader stdin;
    protected BufferedWriter stdout;

    protected UciEngine() {}

    public void runCommand(String command) {
        try {
            stdout.write(command + "\n");
            stdout.flush();
        } catch (IOException e) {
            log.error("Error sending command to UCI engine: {}", command, e);
            throw new RuntimeException("Failed to send command to UCI engine", e);
        }
    }

    public void runCommand(String command, String... args) {
        StringBuilder fullCommand = new StringBuilder(command);
        for (String arg : args) {
            fullCommand.append(" ").append(arg);
        }
        runCommand(fullCommand.toString());
    }

    public void setPostion(String position) {
        runCommand("position", position);
    }
}