import { gql } from "@apollo/client";

export const GET_FEELING_MODAL = gql`
query Query($currentHour: Float) {
  shouldShowFeelingModal(currentHour: $currentHour)
}`
;