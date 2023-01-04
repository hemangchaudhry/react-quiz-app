import axios from "axios"
import React, { useState, useContext, useEffect } from "react"

const table = {
  sports: 21,
  history: 23,
  politics: 24,
  computer: 18,
  general_knowledge: 9,
  books: 10,
  science_nature: 17,
  mathematics: 19,
  anime: 31,
  gadgets: 30,
  geography: 22,
  cartoon: 32,
}

const API_ENDPOINT = "https://opentdb.com/api.php?"
// const temp =
//   "https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple"

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  const [waiting, setWaiting] = useState(true)
  const [loading, setIsLoading] = useState(true)
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [error, setError] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [quiz, setQuiz] = useState({
    amount: 10,
    category: "sports",
    difficulty: "easy",
    // type: "multiple",
  })

  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setQuiz({ ...quiz, [name]: value })
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    const { amount, category, difficulty } = quiz

    const url = `${API_ENDPOINT}amount=${amount}&difficulty=${difficulty}&category=${table[category]}&type=multiple`
    fetchQuestions(url)
  }
  const fetchQuestions = async (url) => {
    setIsLoading(true)
    setWaiting(false)
    const response = await axios(url).catch((error) => console.log(error))
    if (response) {
      const data = response.data.results
      if (data.length > 0) {
        setQuestions(data)
        setIsLoading(false)
        setError(false)
      } else {
        setWaiting(true)
        setError(true)
      }
    } else {
      setWaiting(true)
    }
  }

  // useEffect(() => {
  //   fetchQuestions(temp)
  // }, [])

  const nextQuestion = () => {
    setIndex((oldIndex) => {
      const index = oldIndex + 1
      if (index > questions.length - 1) {
        openModal()
        return 0
      }
      return index
    })
  }

  const checkAnswer = (value) => {
    if (value) {
      setCorrect((oldState) => oldState + 1)
    }
    nextQuestion()
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setWaiting(true)
    setCorrect(0)
    setIsModalOpen(false)
  }

  return (
    <AppContext.Provider
      value={{
        waiting,
        loading,
        questions,
        index,
        correct,
        error,
        isModalOpen,
        nextQuestion,
        checkAnswer,
        closeModal,
        handleChange,
        handleSubmit,
        quiz,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
