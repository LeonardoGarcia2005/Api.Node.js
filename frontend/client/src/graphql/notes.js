import { gql } from "@apollo/client";

export const ALL_NOTES = gql`
  query GetAllNote {
    getAllNote {
      id
      title
      description
      user {
        id
      }
      createdAt
    }
  }
`;

export const CREATE_NOTES = gql`
  mutation CreateNote($input: inputNote) {
    createNote(input: $input) {
      id
      title
      description
      user {
        id
        username
      }
    }
  }
`;

export const EDIT_NOTE = gql`
  mutation UpdateNote($updateNoteId: ID!, $input: inputNote) {
    updateNote(id: $updateNoteId, input: $input) {
      id
      title
      description
      user {
        id
        email
        username
      }
    }
  }
`;

export const DELETE_NOTE = gql`
  mutation DeleteNote($deleteNoteId: ID!, $userId: String) {
    deleteNote(id: $deleteNoteId, userId: $userId) {
      id
      title
      description
      user {
        id
        email
        username
      }
    }
  }
`;
