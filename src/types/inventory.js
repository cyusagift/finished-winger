/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} name
 * @property {string|null} description
 * @property {string} created_at
 */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string|null} category_id
 * @property {string|null} sku
 * @property {number} quantity
 * @property {number} min_stock_level
 * @property {number} cost_price
 * @property {number} selling_price
 * @property {string|null} description
 * @property {string|null} color
 * @property {string|null} size
 * @property {string|null} supplier
 * @property {string} created_at
 * @property {string} updated_at
 * @property {Category} [categories]
 */

/**
 * @param {number} quantity
 * @param {number} minStockLevel
 * @returns {'in-stock'|'low-stock'|'out-of-stock'}
 */
export function getStockStatus(quantity, minStockLevel) {
  if (quantity === 0) return "out-of-stock";
  if (quantity <= minStockLevel) return "low-stock";
  return "in-stock";
}
