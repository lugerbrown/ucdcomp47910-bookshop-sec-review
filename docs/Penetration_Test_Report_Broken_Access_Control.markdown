# Penetration Testing Report

## Table of Contents

- Vulnerabilities
  - A01:2021 Broken Access Control
    - CWE-306: Missing Authentication for Critical Function
    - CWE-639: Authorization Bypass Through User-Controlled Key
    - CWE-1275: Sensitive Cookie with Improper SameSite Attribute
- Conclusions

## Vulnerabilities

### A01:2021 Broken Access Control

#### CWE-306: Missing Authentication for Critical Function
- **Description**: The EmployeePortal application does not require authentication for the `find-user` POST endpoint, allowing unauthenticated users to query user profiles by Personal Identification Number (PIN). This exposes whether a PIN is associated with a registered user and reveals sensitive details (e.g., name, age).
- **CWE Explanation**: CWE-306 occurs when a critical function, such as querying user data, lacks authentication checks, enabling unauthorized access to sensitive operations.
- **Severity**: Critical
- **Location**: `http://192.168.56.101:8080/EmployeePortal/find-user`
- **Source Code Location**: The vulnerability is in `src/main/java/services/employeeportal/controller/AppController.java`, lines 480–490. The endpoint’s method does not verify if the caller is authenticated or has administrative privileges.
- **Exploitation**:
  - An attacker can send a POST request to `/find-user` with a PIN in the request body (e.g., `pin=123456789`).
  - The response redirects to a profile page if the PIN is valid (exposing user details) or to the dashboard if invalid.
  - Example Request (Intercepted in ZAP):
    ```
    POST /EmployeePortal/find-user HTTP/1.1
    Host: 192.168.56.101:8080
    Content-Type: application/x-www-form-urlencoded
    pin=123456789
    ```
  - Example Response (Valid PIN):
    ```
    HTTP/1.1 302 Found
    Location: /EmployeePortal/profile?pin=123456789
    ```
  - Using ZAP’s Fuzzer, an attacker can enumerate PINs to identify valid users.
- **Impact**:
  - Exposure of sensitive user data (e.g., name, age) without authentication.
  - Facilitates targeted attacks (e.g., phishing) by confirming valid PINs.
  - Risks regulatory violations (e.g., GDPR, CCPA).
- **WebGoat Practice**:
  - Replicate in WebGoat’s **Access Control Flaws** > **Missing Function Level Access Control** lesson.
  - Access endpoints like `/WebGoat/find-user` without logging in, using ZAP to send POST requests with different parameters (e.g., `user_id`).
  - Verify the lack of authentication checks by observing responses in ZAP’s History tab.

#### CWE-639: Authorization Bypass Through User-Controlled Key
- **Description**: The application allows any user, including unauthenticated ones, to access user profiles by modifying the `pin` parameter in the URL (Insecure Direct Object Reference, IDOR). PINs are sequential integers, making enumeration straightforward.
- **CWE Explanation**: CWE-639 occurs when an application uses a user-controlled key (e.g., `pin`) without validating ownership, allowing unauthorized access to resources.
- **Severity**: Critical
- **Location**: `http://192.168.56.101:8080/EmployeePortal/profile?pin=<PIN>`
- **Source Code Location**: Found in `src/main/java/services/employeeportal/controller/AppController.java`, line 360. The `profile` endpoint method lacks checks to verify if the requesting user is authorized to view the requested PIN’s profile.
- **Exploitation**:
  - An attacker sends GET requests to `/profile?pin=X`, incrementing `X` (e.g., `pin=1001`, `pin=1002`).
  - Valid PINs return user details (e.g., name, age, department).
  - Example Request (Intercepted in ZAP):
    ```
    GET /EmployeePortal/profile?pin=1002 HTTP/1.1
    Host: 192.168.56.101:8080
    Cookie: JSESSIONID=xyz789
    ```
  - Example Response:
    ```
    HTTP/1.1 200 OK
    Content-Type: text/html
    <html>
    <body>
    <h1>Profile: Jane Smith (pin=1002)</h1>
    <p>Age: 30</p>
    <p>Department: HR</p>
    </body>
    </html>
    ```
  - ZAP’s Forced Browse enumerated valid PINs, revealing all registered users.
- **Impact**:
  - Unauthorized access to all user profiles, exposing sensitive data.
  - Enables data harvesting for social engineering or identity theft.
  - Violates privacy regulations.
- **WebGoat Practice**:
  - Replicate in WebGoat’s **Access Control Flaws** > **Insecure Direct Object References** lesson.
  - Modify `user_id` or similar parameters in ZAP to access other users’ data.
  - Practice enumeration by scripting requests (e.g., using ZAP’s Fuzzer with a PIN list).

#### CWE-1275: Sensitive Cookie with Improper SameSite Attribute
- **Description**: The application’s `JSESSIONID` cookie lacks a `SameSite` attribute, making it vulnerable to Cross-Site Request Forgery (CSRF) attacks. A malicious site could send cross-domain requests that include the user’s session cookie.
- **CWE Explanation**: CWE-1275 occurs when a sensitive cookie (e.g., session cookie) lacks proper attributes, enabling unauthorized actions via CSRF.
- **Severity**: Medium
- **Location**: All endpoints using `JSESSIONID` cookie
- **Source Code Location**: The Spring framework generates the `JSESSIONID` cookie. The application lacks configuration in `application.properties` to set the `SameSite` attribute.
- **Exploitation**:
  - An attacker inspects the cookie via browser developer tools or ZAP, noting the absence of `SameSite`.
  - A malicious site can craft a POST request (e.g., to `/update-profile`) that includes the user’s `JSESSIONID`:
    ```
    POST /EmployeePortal/update-profile HTTP/1.1
    Host: 192.168.56.101:8080
    Cookie: JSESSIONID=xyz789
    Content-Type: application/x-www-form-urlencoded
    name=Attacker
    ```
  - The request executes as the victim, potentially modifying their profile.
  - ZAP’s Active Scan flagged the missing `SameSite` attribute.
- **Impact**:
  - Enables CSRF attacks, allowing unauthorized actions (e.g., profile changes, data deletion).
  - Compromises session integrity, risking unauthorized access.
- **WebGoat Practice**:
  - Replicate in WebGoat’s **Cross-Site Request Forgery (CSRF)** lesson.
  - Use ZAP to inspect cookies for `SameSite` attributes.
  - Simulate a CSRF attack by crafting a malicious HTML form targeting a WebGoat endpoint.

## Conclusions
The EmployeePortal application exhibits critical **OWASP Top 10 A1: Broken Access Control** vulnerabilities (CWE-306, CWE-639, CWE-1275), enabling unauthenticated access to user data, unauthorized profile access via IDOR, and potential CSRF attacks. These issues risk data breaches, privilege escalation, and regulatory non-compliance. Immediate remediation is essential. Practice these vulnerabilities in WebGoat to build detection and exploitation skills before testing your target application.

## Prepared By
- **Tester**: Imarron
- **Date**: July 19, 2025
- **Contact**: imarron@example.com