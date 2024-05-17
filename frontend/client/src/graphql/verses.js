import { gql } from "@apollo/client";

export const LOADING_VERSE = gql`
query LoadVerse {
    loadVerse {
      book {
        modernName
      }
      chapter {
        chapter
      }
      verse {
        verse
        text
      }
    }
  }
`;

export const DAILY_VERSE = gql`
query GetDailyWord {
  getDailyWord {
    book {
      modernName
    }
    chapter {
      chapter
    }
    verse {
      verse
      text
    }
    img {
      imgBase64
    }
  }
}
`;