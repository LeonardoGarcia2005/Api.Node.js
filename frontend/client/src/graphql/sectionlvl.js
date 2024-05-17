import { gql } from "@apollo/client";

export const ALL_SECTIONS = gql`
  query GetSections($offset: Int, $limit: Int) {
    getSections(offset: $offset, limit: $limit) {
      id
      unLockSection
      book {
        modernName
      }
      img {
        imgBase64
      }
    }
  }
`;

export const INTRO_SECTIONS = gql`
query GetSectionById($getSectionByIdId: ID) {
  getSectionById(id: $getSectionByIdId) {
    id
    book {
      modernName
      introduction
    }
    img {
      imgBase64
    }
  }
}`;