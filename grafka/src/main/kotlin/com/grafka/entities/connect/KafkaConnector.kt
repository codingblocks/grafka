import com.grafka.services.KafkaConnectService

class KafkaConnector(val connectId: String, val name:String, service: KafkaConnectService) {
    val config by lazy {service.getConnectorConfig(connectId, name)}
    val status by lazy {service.getConnectorStatus(connectId, name)}
}