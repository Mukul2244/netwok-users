"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FlameIcon, MessageCircle, Smile, Laugh, Heart, UserIcon as Male, UserIcon as Female } from "lucide-react";
import axiosInstance from "@/lib/axios";

const HotnessLevel = ({ hotness, setHotness }: { hotness: string; setHotness: (level: string) => void }) => (
  <div className="grid grid-cols-5 gap-2 mb-4 sm:mb-6">
    {['1', '2', '3', '4', '5'].map((level) => (
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
);

const TypeSelection = ({ handleTypeSelection }: { handleTypeSelection: (type: "question" | "compliment" | "joke" | "pickup_line") => void }) => (
  <div className="grid grid-cols-2 gap-4 mb-4 sm:mb-6">
    <Button onClick={() => handleTypeSelection("question")} className="h-16 sm:h-20 text-base sm:text-lg" variant="outline">
      <MessageCircle className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
      Question
    </Button>
    <Button onClick={() => handleTypeSelection("joke")} className="h-16 sm:h-20 text-base sm:text-lg" variant="outline">
      <Laugh className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
      Joke
    </Button>
    <Button onClick={() => handleTypeSelection("compliment")} className="h-16 sm:h-20 text-base sm:text-lg" variant="outline">
      <Smile className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
      Compliment
    </Button>
    <Button onClick={() => handleTypeSelection("pickup_line")} className="h-16 sm:h-20 text-base sm:text-lg" variant="outline">
      <Heart className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
      Pickup Line
    </Button>
  </div>
);

const GenderSelection = ({ handleGenderSelection }: { handleGenderSelection: (gender: "male" | "female") => void }) => (
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
);

export default function Home() {
  const [type, setType] = useState<"question" | "compliment" | "joke" | "pickup_line" | "">("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [hotness, setHotness] = useState<string>("1"); // Allow null for Mixed Bag
  const [showMixedBagOptions, setShowMixedBagOptions] = useState<boolean>(true);
  const [showGenderOptions, setShowGenderOptions] = useState<boolean>(false);
  const [questions, setQuestions] = useState<{
    id: number;
    type: "question" | "compliment" | "joke" | "pickup_line";
    content: string;
    level: number;
  }[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  const fetchData = useCallback(async () => {
    try {
      let url = `/icebreakers/?type=${type}`;
      if (hotness !== null) {
        url += `&level=${hotness}`;
      }
      if (gender) {
        url += `&gender=${gender}`;
      }
      const response = await axiosInstance.get(url);
      setQuestions(response.data);
      setCurrentQuestionIndex(0); // Reset the question index when new data is fetched
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [type, hotness, gender]);

  useEffect(() => {
    if (type && (!showGenderOptions || gender)) {
      fetchData();
    }
  }, [type, hotness, gender, fetchData, showGenderOptions]);

  const handleTypeSelection = (selectedType: "question" | "compliment" | "joke" | "pickup_line") => {
    setType(selectedType);


    // Show gender options only for "compliment" or "pickup_line"
    if (selectedType === "compliment" || selectedType === "pickup_line") {
      setShowGenderOptions(true);
      setGender(""); // Reset gender selection
    } else {
      setShowGenderOptions(false);
      setGender(""); // Reset gender selection
    }
  }


  const handleGenderSelection = (selectedGender: "male" | "female") => {
    setGender(selectedGender);
    setShowGenderOptions(false); // Hide gender options after selection
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
  };
  const handleMixedBagSelection = () => {
    setShowMixedBagOptions(false);
    setHotness(''); // Remove the level for Mixed Bag
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
        {showMixedBagOptions ? (
          <>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 text-center">Spicy Level</h2>
            <HotnessLevel hotness={hotness} setHotness={setHotness} />
            <div className="grid grid-cols-1 gap-4 mb-4 sm:mb-6">
              <Button
                onClick={() => handleMixedBagSelection()}
                className="h-20 sm:h-24 text-lg sm:text-xl font-bold bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white"
              >
                <FlameIcon className="mr-2 h-6 w-6 sm:h-8 sm:w-8" />
                Mixed Bag (All Levels)
              </Button>
            </div>
            <TypeSelection handleTypeSelection={handleTypeSelection} />
            {showGenderOptions && <GenderSelection handleGenderSelection={handleGenderSelection} />}
          </>
        ) : (
          <>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 text-center">Choose a Category</h2>
            <TypeSelection handleTypeSelection={handleTypeSelection} />
            {showGenderOptions && <GenderSelection handleGenderSelection={handleGenderSelection} />}
            <Button onClick={() => {
              setShowMixedBagOptions(true)
              setHotness('1')
            }}
              className="w-full mt-2 h-12 text-base sm:text-lg" variant="outline">
              Back
            </Button>
          </>
        )}

        {questions.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-center">Question</h3>
            <div className="text-gray-700 text-center mb-4">{questions[currentQuestionIndex].content}</div>
            <Button onClick={handleNextQuestion} className="bg-gradient-to-br from-violet-500 to-fuchsia-500 float-end w-20 h-12 text-base sm:text-lg">
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}