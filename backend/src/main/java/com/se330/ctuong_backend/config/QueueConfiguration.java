package com.se330.ctuong_backend.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableRabbit
public class QueueConfiguration {

    public static final String BOT_QUEUE_NAME = "bot.queue";
    public static final String BOT_EXCHANGE_NAME = "bot.exchange";
    public static final String BOT_ROUTING_KEY = "bot.routing.key";

    @Bean
    public Queue botQueue() {
        return new Queue(BOT_QUEUE_NAME, true); // durable queue
    }

    @Bean
    public DirectExchange botExchange() {
        return new DirectExchange(BOT_EXCHANGE_NAME);
    }

    @Bean
    public Binding botBinding() {
        return BindingBuilder
                .bind(botQueue())
                .to(botExchange())
                .with(BOT_ROUTING_KEY);
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }
}