package com.grafka.entities.topics

import graphql.schema.GraphQLInputType
import graphql.schema.GraphQLType
import graphql.schema.GraphQLTypeVisitor
import graphql.util.TraversalControl
import graphql.util.TraverserContext

data class KafkaTopicConfig(val config: String, val value: String) : GraphQLInputType {
    override fun accept(context: TraverserContext<GraphQLType>?, visitor: GraphQLTypeVisitor?): TraversalControl {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun getName(): String {
        return "KafkaTopicConfig"
    }
}