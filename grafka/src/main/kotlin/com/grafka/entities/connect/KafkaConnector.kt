import com.grafka.services.KafkaConnectService

class KafkaConnector(val connectId: String, val name:String, service: KafkaConnectService) {
    val status by lazy {service.getConnectorStatus(connectId, name)}
}