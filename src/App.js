import { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Routes as RouterRoutes,
  Route,
} from 'react-router-dom'
import { XMLParser } from 'fast-xml-parser'

import { initializeApp } from "firebase/app"
import { getAuth } from 'firebase/auth'
import { getDatabase, onValue, ref } from "firebase/database"

import Home from './Pages/Home'
import Text from './Pages/Text'

import './App.css'
import comeddiaXML from "./commedia.xml"
import { DATABASE_URL, PUNCTUATION } from './Utils/constants'
import Auth from './Pages/Auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import UserComments from './Pages/UserComments'
import MySaved from './Pages/MySaved'

// var firebaseui = require('firebaseui')

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdr-J5RWGRcPZ8icL2kXV7WpJRtT3MA0g",
  authDomain: "divine-comedy-commentary-hub.firebaseapp.com",
  projectId: "divine-comedy-commentary-hub",
  storageBucket: "divine-comedy-commentary-hub.appspot.com",
  messagingSenderId: "475310238712",
  appId: "1:475310238712:web:9d19b743436d935d4a440d",
  databaseUrl: DATABASE_URL,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getDatabase(app)

const App = () => {
  const [user] = useAuthState(auth)

  const [commediaData, setCommediaData] = useState(null)

  const [userUpvotes, setUserUpvotes] = useState(null)
  const [userSaves, setUserSaves] = useState(null)

  useEffect(() => {
    if (!user) {
      setUserUpvotes(null)
      setUserSaves(null)
      return
    }

    const upvotesRef = ref(db, `user-upvotes/${user.uid}`)
    return onValue(upvotesRef, snapshot => {
      const upvotes = snapshot.val()
      if (snapshot.exists()) {
        setUserUpvotes(upvotes)
      }
    })

  }, [user])

  useEffect(() => {
    if (!user) {
      setUserUpvotes(null)
      setUserSaves(null)
      return
    }

    const savesRef = ref(db, `user-saves/${user.uid}`)
    return onValue(savesRef, snapshot => {
      const saves = snapshot.val()
      if (snapshot.exists()) {
        setUserSaves(saves)
      }
    })

  }, [user])

  useEffect(() => {
    const options = {
      preserveOrder: true,
    }
    const parser = new XMLParser(options);

    fetch(comeddiaXML)
      .then((response) => {
        return response.text()
      })
      .then((xmlText) => {
        const jsonData = parser.parse(xmlText)
        const commediaXML = jsonData[1]['TEI.2'][1]['text'][0]['body']

        // console.log("XML original:", commediaXML)

        let commedia = {
          "inferno": [],
          "purgatorio": [],
          "paradiso": []
        }

        for (let p of commediaXML) {
          const part = p["div1"]
          const partName = part[0]["head"][0]["#text"]
          const cantos = part.slice(1)

          let cantoNum = 0
          for (let c of cantos) {
            cantoNum += 1
            const canto = c["div2"]

            const cantoName = canto[0]["head"][0]["#text"]
            const terzinas = canto.slice(1)
            const terzinasList = []
            const linesList = []

            for (let t of terzinas) {
              const terzinaRaw = t["lg"]
              const terzinaLines = []

              for (let l of terzinaRaw) {
                const linePieces = l["l"]
                let line = ""

                if (linePieces.length > 1) {
                  for (let piece of linePieces) {
                    if ("hi" in piece) {
                      const pieceWords = piece["hi"][0]["#text"]
                      const space = PUNCTUATION.includes(pieceWords[0]) ? "" : " "
                      line = line.concat(space, pieceWords)
                    } else {
                      const pieceWords = piece["#text"]
                      const space = PUNCTUATION.includes(pieceWords[0]) ? "" : " "
                      line = line.concat(space, pieceWords)
                    }
                  }
                  line = line.trim()
                  linesList.push(line)
                  terzinaLines.push(line)
                } else if ("hi" in linePieces[0]) {
                  line = linePieces[0]["hi"][0]["#text"]
                  linesList.push(line)
                  terzinaLines.push(line)
                } else {
                  line = linePieces[0]["#text"]
                  linesList.push(line)
                  terzinaLines.push(line)
                }
              }

              terzinasList.push(terzinaLines)
            }

            commedia[partName.toLowerCase()].push({
              "number": cantoNum,
              "name": cantoName.toLowerCase(),
              "length": linesList.length,
              "terzinas": terzinasList,
              "lines": linesList,
            })
          }
        }
        console.log(commedia)
        setCommediaData(commedia)
      })
      .catch((error) => {
        console.error('Error fetching XML data:', error);
      });
  }, [])

  return (
    <div className="App">
      <Router>
        <RouterRoutes>
          <Route path="/" element={<Home />} />
          <Route
            path="/inferno/:canto"
            element={<Text part="inferno" commediaData={commediaData} userUpvotes={userUpvotes} userSaves={userSaves} />}
          />
          <Route
            path="/purgatorio/:canto"
            element={<Text part="purgatorio" commediaData={commediaData} userUpvotes={userUpvotes} userSaves={userSaves} />}
          />
          <Route
            path="/paradiso/:canto"
            element={<Text part="paradiso" commediaData={commediaData} userUpvotes={userUpvotes} userSaves={userSaves} />}
          />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/comments"
            element={<UserComments userUpvotes={userUpvotes} userSaves={userSaves} />}
          />
          <Route
            path="/user/:otherUserId/:otherUserName"
            element={<UserComments userUpvotes={userUpvotes} userSaves={userSaves} />}
          />
          <Route
            path="/saved"
            element={<MySaved userUpvotes={userUpvotes} userSaves={userSaves} />}
          />
          <Route path="*" element={<Home />} />
        </RouterRoutes>
      </Router>
    </div>
  );
}

export default App
