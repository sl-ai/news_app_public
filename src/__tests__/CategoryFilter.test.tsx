import { render, screen, fireEvent } from '@testing-library/react'
import CategoryFilter from '@/components/CategoryFilter'
import { NewsCategory } from '@/types'

const mockCategories: NewsCategory[] = ['general', 'business', 'technology', 'sports']

const mockOnCategoryChange = jest.fn()

describe('CategoryFilter', () => {
  beforeEach(() => {
    mockOnCategoryChange.mockClear()
  })

  it('renders all categories as buttons', () => {
    render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategory="general"
        onCategoryChange={mockOnCategoryChange}
      />
    )
    
    // Check if all categories are rendered
    expect(screen.getByText('General')).toBeInTheDocument()
    expect(screen.getByText('Business')).toBeInTheDocument()
    expect(screen.getByText('Technology')).toBeInTheDocument()
    expect(screen.getByText('Sports')).toBeInTheDocument()
  })

  it('highlights the selected category', () => {
    render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategory="business"
        onCategoryChange={mockOnCategoryChange}
      />
    )
    
    const businessButton = screen.getByRole('button', { name: /filter news by business category/i })
    expect(businessButton).toHaveAttribute('aria-pressed', 'true')
  })

  it('calls onCategoryChange when a category is clicked', () => {
    render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategory="general"
        onCategoryChange={mockOnCategoryChange}
      />
    )
    
    const technologyButton = screen.getByRole('button', { name: /filter news by technology category/i })
    fireEvent.click(technologyButton)
    
    expect(mockOnCategoryChange).toHaveBeenCalledWith('technology')
  })

  it('capitalizes category names correctly', () => {
    render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategory="general"
        onCategoryChange={mockOnCategoryChange}
      />
    )
    
    // Check that category names are capitalized
    expect(screen.getByText('General')).toBeInTheDocument()
    expect(screen.getByText('Business')).toBeInTheDocument()
    expect(screen.getByText('Technology')).toBeInTheDocument()
    expect(screen.getByText('Sports')).toBeInTheDocument()
  })

  it('updates selected category when prop changes', () => {
    const { rerender } = render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategory="general"
        onCategoryChange={mockOnCategoryChange}
      />
    )
    
    // Initially general should be selected
    expect(screen.getByRole('button', { name: /filter news by general category/i })).toHaveAttribute('aria-pressed', 'true')
    
    // Rerender with different selected category
    rerender(
      <CategoryFilter
        categories={mockCategories}
        selectedCategory="sports"
        onCategoryChange={mockOnCategoryChange}
      />
    )
    
    // Now sports should be selected
    expect(screen.getByRole('button', { name: /filter news by sports category/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /filter news by general category/i })).toHaveAttribute('aria-pressed', 'false')
  })

  it('has correct accessibility attributes', () => {
    render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategory="general"
        onCategoryChange={mockOnCategoryChange}
      />
    )
    
    const generalButton = screen.getByRole('button', { name: /filter news by general category/i })
    expect(generalButton).toHaveAttribute('aria-label', 'Filter news by general category')
    expect(generalButton).toHaveAttribute('aria-pressed', 'true')
  })
})
