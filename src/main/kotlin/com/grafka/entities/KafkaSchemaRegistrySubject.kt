import com.grafka.resolvers.SchemaRegistryResolver
import org.slf4j.LoggerFactory
import java.lang.Exception

class KafkaSchemaRegistrySubject(val clusterId:String, val subject: String, val resolver: SchemaRegistryResolver) {
    private val log = LoggerFactory.getLogger(javaClass)

    val metadata by lazy {resolver.schemaMetadata(clusterId, subject)}
    val compatibilityMode by lazy {
        try {
            resolver.schemaCompatibilityMode(clusterId, subject)
        } catch(e: Exception) {
            log.error("Exception retrieving compatibility mode for ${clusterId}:${subject}")
            log.error(e.toString())
            // TODO Why is this failing?
            "!ERROR!"
        }
    }
}