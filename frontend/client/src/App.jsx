// Importa las dependencias necesarias de Apollo Client
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
/* ------------------------------------------------------------------------ */
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./page/Homepage";
import InicialBible from "./page/InicialBible";
import SectionLvl from "./page/SectionLvl";
import Signup from "./page/Signup";
import Login from "./page/Login";
import InicialPage from "./page/InicialPage";
import Note from "./page/Note";
import LevIntro from "./page/LevIntro";
import Levels from "./page/Levels";
import Teaching from "./page/Teaching";
import Glossary from "./page/Glossary";
import Character from "./page/Character";
import CharacterData from "./page/CharacterData";
import Video from "./page/Video";
import Question from "./page/Question";
import Stories from "./page/Stories";
import Achievements from "./page/Achievements";
import OfficialBible from "./page/OfficialBible";
import ProtectedRouter from "./public/ProtectedRouter";
import TokenVerification from "./public/VerifyToken";
import { AuthProvider } from "./context/AuthContext";
import { ThemeContextProvider } from "./context/ThemeContext";
import ResultLevel from "./components/ResultLevel";
import Games from "./page/Games";
import Ranking from "./page/Ranking";
import Discussion from "./page/Discussion"
import ContactUs from "./page/ContactUs";
import TeachingData from "./page/TeachingData"
import { GoogleOAuthProvider } from '@react-oauth/google'

const httpLink = createHttpLink({
  uri: "http://localhost:4000/",
});

// Crea un enlace de autenticación que agrega el token de autorización a las solicitudes
const authLink = setContext((_, { headers }) => {
  // Obtiene el token de localStorage
  const token = localStorage.getItem("token");

  // Devuelve los headers con el token de autorización agregado
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : "",
    },
  };
});

// Crea una instancia de Apollo Client configurada con el enlace de autenticación y el enlace HTTP
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    /* aqui se ubica las rutas para conectar las paginas con otras */
    <ApolloProvider client={client}>
      <div className="Bg-personality">
        <BrowserRouter>
          <ThemeContextProvider>
            <AuthProvider>
              <TokenVerification />
              <GoogleOAuthProvider clientId="214929717096-6eovhusc4ondcp2e71r5ggvktruq9rp7.apps.googleusercontent.com">
              <Routes>
                <Route path="/" element={<InicialPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/inicialbible" element={<InicialBible />} />
                <Route element={<ProtectedRouter />}>
                  {/* Rutas protegidas y verificacion del token */}      
                  <Route path="/sectionlvl" element={<SectionLvl />} />       
                  <Route path="/levintro/:sectionId" element={<LevIntro />} /> 
                  <Route path="/levels/:sectionId?" element={<Levels />} />
                  <Route path="/stories/:levelId" element={<Stories/>}/>
                  <Route path="/question/:levelId" element={<Question />} />
                  <Route path="/resultlevel/:levelId" element={<ResultLevel />} />
                  <Route path="/officialbible/:bookName?/:bookNumber?/:chapterNum?/:chapterId?" element={<OfficialBible />} />
                  <Route path="/achievements" element={<Achievements />} />
                  <Route path="/homepage" element={<Homepage />} />
                  <Route path="/add-nota" element={<Note />} />
                  <Route path="/nota/:id" element={<Note />} />
                  <Route path="/teaching" element={<Teaching />} />
                  <Route path="/character" element={<Character />} />
                  <Route path="/characterdata/:characterId" element={<CharacterData />} />
                  <Route path="/glossary" element={<Glossary />} />
                  <Route path="/video" element={<Video />} />
                  <Route path="/games" element={<Games />}/>
                  <Route path="/ranking" element={<Ranking />}/>
                  <Route path="/discussion" element={<Discussion />}/>
                  <Route path="/contactUs" element={<ContactUs />}/>
                  <Route path="/teachingdata" element={<TeachingData />}/>
                </Route>
              </Routes>
              </GoogleOAuthProvider>
            </AuthProvider>
          </ThemeContextProvider>
        </BrowserRouter>
      </div>
    </ApolloProvider>
    /* ------------------------------------------------------ */
  );
}

export default App;
