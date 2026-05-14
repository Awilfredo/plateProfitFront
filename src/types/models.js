/**
 * @typedef {Object} Unit
 * @property {number} id
 * @property {string} name
 * @property {string} symbol
 * @property {'weight' | 'volume' | 'count'} type
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} UnitConversion
 * @property {number} id
 * @property {number} from_unit_id
 * @property {number} to_unit_id
 * @property {number} conversion_factor
 * @property {string} created_at
 * @property {string} updated_at
 * @property {Unit} [from_unit]
 * @property {Unit} [to_unit]
 */

/**
 * @typedef {Object} Ingredient
 * @property {number} id
 * @property {string} name
 * @property {number} purchase_price
 * @property {number} purchase_quantity
 * @property {number} purchase_unit_id
 * @property {Unit} [purchase_unit]
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Recipe
 * @property {number} id
 * @property {string} name
 * @property {string | null} description
 * @property {number} servings
 * @property {IngredientRecipe[]} [ingredients]
 * @property {RecipeComponent[]} [components]
 * @property {{ total_cost: number, cost_per_serving: number }} [cost]
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} RecipeComponent
 * @property {number} id
 * @property {number} recipe_id
 * @property {number} component_recipe_id
 * @property {number} quantity
 * @property {number} unit_id
 * @property {Unit} [unit]
 * @property {{ id: number, name: string }} [recipe]
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} IngredientRecipe
 * @property {number} id
 * @property {number} ingredient_id
 * @property {number} recipe_id
 * @property {number} quantity
 * @property {number} unit_id
 * @property {Unit} [unit]
 * @property {Ingredient} [ingredient]
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Recipe} RecipeWithIngredients
 */

/**
 * @typedef {Object} IngredientCost
 * @property {number} ingredient_id
 * @property {string} name
 * @property {number} quantity_used
 * @property {string} unit
 * @property {number} cost_per_recipe
 * @property {number} [conversion_factor]
 * @property {boolean} [is_recipe]
 */

/**
 * @typedef {Object} RecipeCostSummary
 * @property {number} recipe_id
 * @property {string} recipe_name
 * @property {number} servings
 * @property {IngredientCost[]} ingredients_cost
 * @property {number} total_cost
 * @property {number} cost_per_serving
 */