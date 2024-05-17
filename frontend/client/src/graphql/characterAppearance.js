import { gql } from "@apollo/client";

export const CHAR_APPEAR = gql`
  query GetCharacterFirstAppearance($getCharacterFirstAppearanceId: ID) {
    getCharacterFirstAppearance(id: $getCharacterFirstAppearanceId) {
      id
      verse {
        verse
        text
      }
      chapter {
        id
        chapter
      }
      book {
        id
        modernName
      }
    }
  }
`;
