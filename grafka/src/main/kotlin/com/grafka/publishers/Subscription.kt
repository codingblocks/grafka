package com.grafka.publishers

import com.grafka.entities.KafkaMessage
import com.coxautodev.graphql.tools.GraphQLSubscriptionResolver
import org.reactivestreams.Publisher
import org.springframework.stereotype.Component
import java.time.Duration

@Component
class Subscription(private val messagePublisher: KafkaMessagePublisher) : GraphQLSubscriptionResolver {
    fun messages(clusterId: String, topic: String, keyDeserializer: String?, valueDeserializer: String?, latchSize: Int = 100, latchTimeoutMs: Long = 50, startingOffset:Long = 0): Publisher<List<KafkaMessage>> {
        val publisher = messagePublisher.getPublisher(clusterId, topic, startingOffset, keyDeserializer, valueDeserializer)
                .bufferTimeout(latchSize, Duration.ofMillis(latchTimeoutMs))
                .publish()
                .autoConnect()
        return publisher
    }

}