import { gql } from "@apollo/client";

export const ALL_CHARACTER = gql`
  query GetCharacters($offset: Int, $limit: Int, $name: String) {
    getCharacters(offset: $offset, limit: $limit, name: $name) {
      id
      name
      img {
        imgBase64
      }
    }
  }`
;

export const GET_CHARACTER = gql`
  query Query($getCharacterByIdId: ID) {
    getCharacterById(id: $getCharacterByIdId) {
      id
      name
      description
      meaningName
      img {
        imgBase64
      }
    }
  }`
;

