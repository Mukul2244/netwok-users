"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FlameIcon, MessageCircle, Smile, Laugh, Heart, UserIcon as Male, UserIcon as Female } from "lucide-react"
// import api from "@/lib/axios"

export default function Home() {
  const [hotness, setHotness] = useState<number>(1)
  const [showMixedBagOptions, setShowMixedBagOptions] = useState(true)
  const [showGenderOptions, setShowGenderOptions] = useState<"compliment" | "pickup" | null>(null)

  const handleTypeSelection = (type: "question" | "compliment" | "joke" | "pickup" | "mixed") => {
    if (type === "mixed") {
      setShowMixedBagOptions(false)
    } else {
      if (type === "compliment" || type === "pickup") {
        setShowGenderOptions(type)
      }
    }
  }

  const handleMixedBagSelection = (type: "question" | "compliment" | "joke" | "pickup") => {
    if (type === "compliment" || type === "pickup") {
      setShowGenderOptions(type)
    }
  }

  const handleGenderSelection = (gender: "male" | "female") => {
    console.log(`Selected gender: ${gender}`)
    setShowGenderOptions(null)
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-md rounded-3xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
        {
          showMixedBagOptions ? (
            <>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 text-center">Spicy Level</h2>
              <div className="grid grid-cols-5 gap-2 mb-4 sm:mb-6">
                {[1, 2, 3, 4, 5].map((level) => (
                  <Button
                    key={level}
                    onClick={() => setHotness(level)}
                    variant={hotness === level ? "default" : "outline"}
                    className={`h-10 sm:h-12 ${hotness === level ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white" : ""}`}
                  >
                    {level}
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-4 mb-4 sm:mb-6">
                <Button
                  onClick={() => handleTypeSelection("mixed")}
                  className="h-20 sm:h-24 text-lg sm:text-xl font-bold bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white "
                >
                  <FlameIcon className="mr-2 h-6 w-6 sm:h-8 sm:w-8" />
                  Mixed Bag (All Levels)
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 sm:mb-6">
                <Button
                  onClick={() => handleTypeSelection("question")}
                  className="h-16 sm:h-20 text-base sm:text-lg"
                  variant="outline"
                >
                  <MessageCircle className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                  Question
                </Button>
                <Button
                  onClick={() => handleTypeSelection("joke")}
                  className="h-16 sm:h-20 text-base sm:text-lg"
                  variant="outline"
                >
                  <Laugh className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                  Joke
                </Button>
                <Button
                  onClick={() => handleTypeSelection("compliment")}
                  className="h-16 sm:h-20 text-base sm:text-lg"
                  variant="outline"
                >
                  <Smile className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                  Compliment
                </Button>
                <Button
                  onClick={() => handleTypeSelection("pickup")}
                  className="h-16 sm:h-20 text-base sm:text-lg"
                  variant="outline"
                >
                  <Heart className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                  Pickup Line
                </Button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 text-center">Choose a Category</h2>
              <div className="grid grid-cols-2 gap-4 mb-4 sm:mb-6">
                <Button
                  onClick={() => handleMixedBagSelection("question")}
                  className="h-16 sm:h-20 text-base sm:text-lg"
                  variant="outline"
                >
                  <MessageCircle className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                  Question
                </Button>
                <Button
                  onClick={() => handleMixedBagSelection("joke")}
                  className="h-16 sm:h-20 text-base sm:text-lg"
                  variant="outline"
                >
                  <Laugh className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                  Joke
                </Button>
                <Button
                  onClick={() => handleMixedBagSelection("compliment")}
                  className="h-16 sm:h-20 text-base sm:text-lg"
                  variant="outline"
                >
                  <Smile className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                  Compliment
                </Button>
                <Button
                  onClick={() => handleMixedBagSelection("pickup")}
                  className="h-16 sm:h-20 text-base sm:text-lg"
                  variant="outline"
                >
                  <Heart className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                  Pickup Line
                </Button>
              </div>
              <Button
                onClick={() => setShowMixedBagOptions(true)}
                className="w-full h-12 text-base sm:text-lg"
                variant="outline"
              >
                Back
              </Button>
            </>
          )
        }

        {showGenderOptions && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-center">Choose Target Gender</h3>
            <div className="flex justify-center gap-4">
              <Button onClick={() => handleGenderSelection("male")} className="flex-1 h-12" variant="outline">
                <Male className="mr-2 h-5 w-5" />
                For Him
              </Button>
              <Button onClick={() => handleGenderSelection("female")} className="flex-1 h-12" variant="outline">
                <Female className="mr-2 h-5 w-5" />
                For Her
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

