import { gql } from "@apollo/client";

//Servicio que funciona para registrar un usuario
export const REGISTER_USER = gql`
  mutation RegisterUser($input: SignupInput!) {
    registerUser(input: $input) {
      id
      email
      username
      userJwtToken {
        token
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($input: LoginInput!) {
    loginUser(input: $input) {
      id
      email
      username
      userJwtToken {
        token
      }
    }
  }
`;

export const VERIFY_TOKEN = gql`
  mutation VerifyToken($token: String!) {
    verifyToken(token: $token) {
      success
    }
  }
`;

export const SIGN_UP_GOOGLE = gql`
  mutation SignUpGoogle($accessToken: String!) {
    signUpGoogle(accessToken: $accessToken) {
      id
      email
      username
      userJwtToken {
        token
      }
    }
  }
`;
