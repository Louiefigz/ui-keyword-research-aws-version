import { render, screen, fireEvent } from '@/test-utils';
import { OpportunityCard } from '@/components/features/strategic/OpportunityCard';
import type { OpportunityItem } from '@/types';

const mockOpportunity: OpportunityItem = {
  id: '1',
  title: 'Optimize Meta Descriptions',
  description: 'Update meta descriptions for top 20 pages to improve CTR',
  type: 'quick_wins',
  impact_score: 85,
  difficulty: 25,
  estimated_traffic: 5000,
  estimated_value: '$2,500',
  timeline: '2 weeks',
  effort_required: '5-10 hours',
  keywords_affected: ['meta description seo', 'meta tags', 'seo optimization', 'title tags'],
  action_steps: ['Audit current meta descriptions', 'Write new descriptions', 'A/B test'],
};

describe('OpportunityCard', () => {
  it('renders opportunity information correctly', () => {
    render(<OpportunityCard opportunity={mockOpportunity} />);

    // Basic info
    expect(screen.getByText('Optimize Meta Descriptions')).toBeInTheDocument();
    expect(screen.getByText('Update meta descriptions for top 20 pages to improve CTR')).toBeInTheDocument();

    // Metrics
    expect(screen.getByText('85/100')).toBeInTheDocument(); // Impact score
    expect(screen.getByText('25/100')).toBeInTheDocument(); // Difficulty
    expect(screen.getByText('5,000')).toBeInTheDocument(); // Traffic
    expect(screen.getByText('$2,500')).toBeInTheDocument(); // Value
    expect(screen.getByText('2 weeks')).toBeInTheDocument(); // Timeline

    // Effort
    expect(screen.getByText('Required Effort')).toBeInTheDocument();
    expect(screen.getByText('5-10 hours')).toBeInTheDocument();
  });

  it('displays keywords affected with overflow handling', () => {
    render(<OpportunityCard opportunity={mockOpportunity} />);

    // Should show first 3 keywords
    expect(screen.getByText('meta description seo')).toBeInTheDocument();
    expect(screen.getByText('meta tags')).toBeInTheDocument();
    expect(screen.getByText('seo optimization')).toBeInTheDocument();

    // Should show overflow indicator
    expect(screen.getByText('+1 more')).toBeInTheDocument();

    // Should not show 4th keyword
    expect(screen.queryByText('title tags')).not.toBeInTheDocument();
  });

  it('applies correct styling based on opportunity type', () => {
    const { rerender } = render(<OpportunityCard opportunity={mockOpportunity} />);
    
    // Quick wins - green
    expect(screen.getByRole('article')).toHaveClass('border-green-200', 'bg-green-50');

    // Content gaps - orange
    const contentGapOpp = { ...mockOpportunity, type: 'content_gaps' as const };
    rerender(<OpportunityCard opportunity={contentGapOpp} />);
    expect(screen.getByRole('article')).toHaveClass('border-orange-200', 'bg-orange-50');

    // Technical - blue
    const technicalOpp = { ...mockOpportunity, type: 'technical' as const };
    rerender(<OpportunityCard opportunity={technicalOpp} />);
    expect(screen.getByRole('article')).toHaveClass('border-blue-200', 'bg-blue-50');

    // Competitive - purple
    const competitiveOpp = { ...mockOpportunity, type: 'competitive' as const };
    rerender(<OpportunityCard opportunity={competitiveOpp} />);
    expect(screen.getByRole('article')).toHaveClass('border-purple-200', 'bg-purple-50');
  });

  it('applies correct color to impact score', () => {
    const { rerender } = render(<OpportunityCard opportunity={mockOpportunity} />);
    
    // High impact (>=80) - green
    expect(screen.getByText('85/100')).toHaveClass('text-green-600');

    // Medium impact (60-79) - yellow
    const mediumImpact = { ...mockOpportunity, impact_score: 65 };
    rerender(<OpportunityCard opportunity={mediumImpact} />);
    expect(screen.getByText('65/100')).toHaveClass('text-yellow-600');

    // Low impact (<60) - gray
    const lowImpact = { ...mockOpportunity, impact_score: 45 };
    rerender(<OpportunityCard opportunity={lowImpact} />);
    expect(screen.getByText('45/100')).toHaveClass('text-gray-600');
  });

  it('applies correct color to difficulty score', () => {
    const { rerender } = render(<OpportunityCard opportunity={mockOpportunity} />);
    
    // Low difficulty (<=30) - green
    expect(screen.getByText('25/100')).toHaveClass('text-green-600');

    // Medium difficulty (31-60) - yellow
    const mediumDiff = { ...mockOpportunity, difficulty: 45 };
    rerender(<OpportunityCard opportunity={mediumDiff} />);
    expect(screen.getByText('45/100')).toHaveClass('text-yellow-600');

    // High difficulty (>60) - red
    const highDiff = { ...mockOpportunity, difficulty: 75 };
    rerender(<OpportunityCard opportunity={highDiff} />);
    expect(screen.getByText('75/100')).toHaveClass('text-red-600');
  });

  it('handles opportunity with no keywords', () => {
    const noKeywordsOpp = { ...mockOpportunity, keywords_affected: [] };
    render(<OpportunityCard opportunity={noKeywordsOpp} />);

    // Should not show keywords section
    expect(screen.queryByText('Keywords Affected')).not.toBeInTheDocument();
  });

  it('renders action button', () => {
    render(<OpportunityCard opportunity={mockOpportunity} />);

    const button = screen.getByRole('button', { name: /view action steps/i });
    expect(button).toBeInTheDocument();
  });

  it('displays correct icons for metrics', () => {
    render(<OpportunityCard opportunity={mockOpportunity} />);

    // Check for metric labels
    expect(screen.getByText('Est. Traffic')).toBeInTheDocument();
    expect(screen.getByText('Est. Value')).toBeInTheDocument();
    expect(screen.getByText('Timeline')).toBeInTheDocument();
  });
});