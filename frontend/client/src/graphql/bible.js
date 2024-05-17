import { gql } from "@apollo/client";

export const VERSIONES_BIBLIA = gql`
  query GetAllVersion {
    getAllVersion {
      id
      version
    }
  }
`;

export const LIBROS_BIBLIA = gql`
  query GetBooksByBibleId($getBooksByBibleIdId: ID) {
    getBooksByBibleId(id: $getBooksByBibleIdId) {
      id
      modernName
    }
  }
`;

export const CAPITULOS_BIBLIA = gql`
  query GetChaptersByBookId($getChaptersByBookIdId: ID) {
    getChaptersByBookId(id: $getChaptersByBookIdId) {
      id
      chapter
    }
  }
`;

export const VERSICULO_BIBLIA = gql`
  query GetVersesByChapterId($getVersesByChapterIdId: ID) {
    getVersesByChapterId(id: $getVersesByChapterIdId) {
      id
      verse
      text
    }
  }
`;
