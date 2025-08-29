import { render, screen, fireEvent } from '@testing-library/react'
import DatePicker from '@/components/DatePicker'

const mockOnDateChange = jest.fn()

describe('DatePicker', () => {
  beforeEach(() => {
    mockOnDateChange.mockClear()
  })

  it('renders date picker with label', () => {
    render(
      <DatePicker
        selectedDate="2024-01-15"
        onDateChange={mockOnDateChange}
      />
    )
    
    expect(screen.getByText('Select Date:')).toBeInTheDocument()
    expect(screen.getByLabelText('Select Date:')).toBeInTheDocument()
  })

  it('displays the selected date', () => {
    render(
      <DatePicker
        selectedDate="2024-01-15"
        onDateChange={mockOnDateChange}
      />
    )
    
    const dateInput = screen.getByLabelText('Select Date:')
    expect(dateInput).toHaveValue('2024-01-15')
  })

  it('calls onDateChange when date is changed', () => {
    render(
      <DatePicker
        selectedDate="2024-01-15"
        onDateChange={mockOnDateChange}
      />
    )
    
    const dateInput = screen.getByLabelText('Select Date:')
    fireEvent.change(dateInput, { target: { value: '2024-01-20' } })
    
    expect(mockOnDateChange).toHaveBeenCalledWith('2024-01-20')
  })

  it('updates displayed date when prop changes', () => {
    const { rerender } = render(
      <DatePicker
        selectedDate="2024-01-15"
        onDateChange={mockOnDateChange}
      />
    )
    
    // Initially should show 2024-01-15
    expect(screen.getByLabelText('Select Date:')).toHaveValue('2024-01-15')
    
    // Rerender with different date
    rerender(
      <DatePicker
        selectedDate="2024-01-25"
        onDateChange={mockOnDateChange}
      />
    )
    
    // Should now show 2024-01-25
    expect(screen.getByLabelText('Select Date:')).toHaveValue('2024-01-25')
  })

  it('has correct date constraints', () => {
    render(
      <DatePicker
        selectedDate="2024-01-15"
        onDateChange={mockOnDateChange}
      />
    )
    
    const dateInput = screen.getByLabelText('Select Date:')
    
    // Should have min and max attributes
    expect(dateInput).toHaveAttribute('min')
    expect(dateInput).toHaveAttribute('max')
  })

  it('has correct input type and styling classes', () => {
    render(
      <DatePicker
        selectedDate="2024-01-15"
        onDateChange={mockOnDateChange}
      />
    )
    
    const dateInput = screen.getByLabelText('Select Date:')
    
    expect(dateInput).toHaveAttribute('type', 'date')
    expect(dateInput).toHaveClass('bg-gray-800')
    expect(dateInput).toHaveClass('px-3')
    expect(dateInput).toHaveClass('py-2')
    expect(dateInput).toHaveClass('rounded-md')
  })

  it('has proper accessibility attributes', () => {
    render(
      <DatePicker
        selectedDate="2024-01-15"
        onDateChange={mockOnDateChange}
      />
    )
    
    const label = screen.getByText('Select Date:')
    const dateInput = screen.getByLabelText('Select Date:')
    
    expect(label).toHaveAttribute('for', 'newsDate')
    expect(dateInput).toHaveAttribute('id', 'newsDate')
  })
})
