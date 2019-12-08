package com.grafka.services

import com.grafka.repositories.KafkaConnectConfigRepository
import org.springframework.stereotype.Service
import java.io.StringReader
import java.net.HttpURLConnection
import java.net.URL
import java.nio.charset.Charset
import java.nio.charset.StandardCharsets
import java.util.*

@Service
class KafkaConnectService(val repository: KafkaConnectConfigRepository) {

    fun getConnectors(connectId:String) = request(connectId, "/connectors")

//    fun getConnectorStatus(): String? {
//        val connectorJson = getConnectors()!!
//        val connectorList = Regex("[^\\w,_-]").replace(connectorJson, "").split(",")
//        if(connectorList.size == 1 && connectorList.first() == "") {
//            return "[]"
//        }
//        // yeah, this is ugly but I don't want to do the research right now!
//        val allStatus = connectorList.map { getConnectorStatus(it) }.joinToString(",")
//        return "[${allStatus}]"
//    }

//    fun exportConfigs(name:String): String? {
//        // yeah, this is ugly but I don't want to do the research right now!
//        val allConfigs = name.split(",").map { getConnectorConfig(it) }.joinToString(",")
//        return "[${allConfigs}]"
//    }

//
//    @Get("/connectors")

//
//    @Get("/connectors/connector-plugins")
//    fun getConnectorPlugins(name:String): String? {
//        return simpleRequest("$connectUrl/connectors/${name}/status")
//    }
//
//    @Get("/connector/{name}")
//    fun getConnector(name:String): String? {
//        return simpleRequest("$connectUrl/connectors/${name}")
//    }
//
//    @Get("/connector/{name}/config")
//    fun getConnectorConfig(name:String): String? {
//        return simpleRequest("$connectUrl/connectors/${name}/config")
//    }
//
//    @Get("/connector/{name}/status")
//    fun getConnectorStatus(name:String): String? {
//        return simpleRequest("$connectUrl/connectors/${name}/status")
//    }
//
//    // POST
//    @Post("/connectors/{name}")
//    fun saveConnector(name:String, @Body json:String): String? {
//        //val existingConfig = getConnectorConfig(json.name)
//        // if it already exists, then delete it and re-create
//        try {
//            val result = simpleRequest("$connectUrl/connectors", "POST", json)
//            service.initializeTopicWithDefaults(name)
//            return result
//        } catch(e:Exception) {
//            // TODO only 409
//            simpleRequest("$connectUrl/connectors/${name}", "DELETE")
//            Thread.sleep(2000)
//            val result = simpleRequest("$connectUrl/connectors", "POST", json)
//            service.initializeTopicWithDefaults(name)
//            return result
//        }
//    }
//
//    @Post("/connector/{name}/restart")
//    fun restartConnector(name:String): String? {
//        for (s in name.split(",")) {
//            simpleRequest("$connectUrl/connectors/${s}/restart", "POST")
//        }
//        return "{}"
//    }
//
//
//    // PUT
//
//    @Put("/connector/{name}/pause")
//    fun pauseConnector(name:String): String? {
//        for (s in name.split(",")) {
//            simpleRequest("$connectUrl/connectors/${s}/pause", "PUT")
//        }
//        return "{}"
//    }
//
//    @Put("/connector/{name}/resume")
//    fun resumeConnector(name:String): String? {
//        for (s in name.split(",")) {
//            simpleRequest("$connectUrl/connectors/${s}/resume", "PUT")
//        }
//        return "{}"
//    }
//
//    // Delete
//
//    @Delete("/connector/{name}/remove")
//    fun removeConnector(name:String): String? {
//        for (s in name.split(",")) {
//            simpleRequest("$connectUrl/connectors/${s}", "DELETE")
//        }
//        return "{}"
//    }
//
    // Helper
    fun request(connectId: String, path: String, method:String = "GET", body: String? = null): String {
        val config = repository.getOne(UUID.fromString(connectId)).config
        val p = Properties()
        p.load(StringReader(config))
        val url = p["url"].toString()
        val username = p["username"]?.toString()
        val password = p["password"]?.toString()
        val basicAuth = !(username.isNullOrEmpty() || password.isNullOrEmpty())
        // TODO what else? What else matters? ssl? etc?

        val sb = StringBuffer()
        with(URL("$url$path").openConnection() as HttpURLConnection) {
            requestMethod = method
            if(basicAuth) {
                val encoded = Base64.getEncoder().encodeToString((username + ":" + password).toByteArray(StandardCharsets.UTF_8))  //Java 8
                setRequestProperty("Authorization", "Basic $encoded")
            }

            if(body != null) {
                addRequestProperty("Content-Type", "application/json")
                doOutput = true
                getOutputStream().use { os ->
                    val input = body.toByteArray(Charset.defaultCharset())
                    os.write(input, 0, input.size)
                }
            }

            inputStream.bufferedReader().use { it.lines().forEach { sb.append(it) } }
        }
        return sb.toString()
    }
}