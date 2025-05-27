package com.se330.ctuong_backend.config;

import com.se330.ctuong_backend.service.engine.FairyStockfishEnginePool;
import com.se330.ctuong_backend.service.engine.FairyStockFishEngine;
import org.apache.commons.pool2.impl.GenericObjectPool;
import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
public class EngineConfiguration {
    private static final int MAX_ENGINE_COUNT = 2; // Maximum number of engines in the pool

    @Bean
    public GenericObjectPool<FairyStockFishEngine> fairyStockFishEnginePool() {
        GenericObjectPoolConfig<FairyStockFishEngine> config = new GenericObjectPoolConfig<>();
        config.setMaxTotal(MAX_ENGINE_COUNT);
        config.setBlockWhenExhausted(true);
        config.setMinEvictableIdleDuration(Duration.ofMillis(15000));
        config.setMaxWait(Duration.ofMillis(5000));
        config.setJmxEnabled(false);
        return new GenericObjectPool<>(new FairyStockfishEnginePool(), config);
    }
}
