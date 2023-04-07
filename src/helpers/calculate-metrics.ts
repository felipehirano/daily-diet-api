export type Meals = {
  id: string
  user_id: string
  name: string
  description: string
  is_diet: boolean
  created_at: string
  date_time: string
  timestamp?: number
}

export function calculateMetrics(meals: Meals[]) {
  const totalMeals = meals.length
  const totalMealsOnDiet = meals.filter((meal: any) => meal.is_diet).length
  const totalMealsOutOfDiet = meals.filter(
    (meal: any) => meal.is_diet === 0,
  ).length

  const totalMealsOfSequence = getSequenceMealsOnDiet(meals)

  return {
    totalMeals,
    totalMealsOnDiet,
    totalMealsOutOfDiet,
    totalMealsOfSequence,
  }
}

function addTimeStampOnMeals(meals: Meals[]) {
  return meals.map((meal) => {
    meal.timestamp = Math.floor(new Date(meal.date_time).getTime() / 1000)
    return { ...meal }
  })
}

function orderMealsByTimeStamp(meals: Meals[]) {
  return addTimeStampOnMeals(meals).sort((a, b) =>
    a.date_time.localeCompare(b.date_time),
  )
}

function getSequenceMealsOnDiet(meals: Meals[]) {
  let currentCount = 1
  let maxCount = 1

  const orderedMeals = orderMealsByTimeStamp(meals)

  for (let i = 1; i < orderedMeals.length; i++) {
    if (orderedMeals[i].is_diet === orderedMeals[i - 1].is_diet) {
      currentCount++
    } else {
      if (currentCount > maxCount) {
        maxCount = currentCount
      }
      currentCount = 1
    }
  }

  if (currentCount > maxCount) {
    maxCount = currentCount
  }

  return maxCount
}
