package val.example.demo;

import org.json.JSONObject;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class BanqueItinovApplicationTests {

	@Autowired
	private TestRestTemplate template;

	@Test
	public void getHello() throws Exception {
		long id = 1L;
		ResponseEntity<String> response = template.getForEntity("/greeting", String.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getHeaders().getContentType()).isEqualTo(MediaType.APPLICATION_JSON);

		JSONObject jsonResponse = new JSONObject(response.getBody());
		assertThat(jsonResponse.getLong("id")).isEqualTo(1L);
		assertThat(jsonResponse.getString("content")).isEqualTo("Hello, World!");
	}

	@Test
	public void testHealthEndpoint() throws Exception {
		ResponseEntity<String> response = template.getForEntity("/actuator/health", String.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getHeaders().getContentType()).isEqualTo(MediaType.APPLICATION_JSON);
		JSONObject jsonResponse = new JSONObject(response.getBody());
		assertThat(jsonResponse.getString("status")).isEqualTo("UP");
	}
}
