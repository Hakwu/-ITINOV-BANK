package val.example.demo.user;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;
import val.example.demo.account.Account;
import val.example.demo.api.ApiResponse;
import val.example.demo.api.ResponseBuilder;

import java.util.List;

@AllArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final ResponseBuilder responseBuilder;
    public ResponseEntity<ApiResponse> getAllUser() {
        try {
            return responseBuilder.buildResponse(HttpStatus.OK.value(), "", userRepository.findAll());
        } catch (Exception e) {
            return responseBuilder.buildResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage(), "");
        }
    }
    public ResponseEntity<ApiResponse> getUserById(String id) {
        try {
            return responseBuilder.buildResponse(HttpStatus.OK.value(), "", userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found !")));
        } catch (IllegalArgumentException e) {
            return responseBuilder.buildResponse(HttpStatus.NOT_FOUND.value(), e.getMessage(), "");
        } catch (Exception e) {
            return responseBuilder.buildResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage(), "");
        }
    }
}
