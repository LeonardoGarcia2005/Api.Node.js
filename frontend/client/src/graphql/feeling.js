import { gql } from "@apollo/client";

export const ALL_FEELING = gql` 
query Query {
    getAllFeeling {
      id
      typeFeeling
      img {
        imgBase64
      }
    }
  }`
;

export const VERSE_FEEL = gql`
query Query($getOneVerseFeelingId: ID) {
  getOneVerseFeeling(id: $getOneVerseFeelingId) {
    id
    verse {
      verse
      text
    }
    chapter {
      chapter
    }
    book {
      modernName
    }
    img {
      imgBase64
    }
  }
}
`