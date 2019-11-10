import {
  Close,
  Home,
  Public,
  RemoveRedEye,
  Settings,
  Subscriptions,
  Storage
} from "@material-ui/icons/";

export default {
  elevation: 5,
  graphqlUrl: "http://localhost:9000/graphql",
  graphqlWebSocketUrl: "ws://localhost:9000/subscriptions",
  queryUiUrl: "http://localhost:9000/altair",
  icons: {
    ConsumerGroups: RemoveRedEye,
    Close,
    Clusters: Storage,
    Home,
    QueryUI: Public,
    Settings,
    Topics: Subscriptions
  }
};
