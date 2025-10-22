import { useState } from "react";
import { Suggestion } from "@/types/suggestions";
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import Spinner from "./common/Spinner";

interface SuggestionChipsProps {
  suggestions?: Suggestion[] | undefined;
  getSuggestions?: () => void;
  suggestionsLoading?: boolean;
}

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({ suggestions, getSuggestions, suggestionsLoading }) => {
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);
  
  const hasSuggestions = suggestions && Array.isArray(suggestions) && suggestions.length > 0;

  return (
    <div className="mt-4 pt-2">
      {!hasSuggestions ? (
        suggestionsLoading ? (
          <Spinner />
        ) : (
        <button onClick={getSuggestions}>
          <TipsAndUpdatesIcon/>
        </button>
        )
      ) : (
        <div className="flex flex-wrap gap-2 mt-2">
          {hasSuggestions && suggestions.map((suggestion: Suggestion) => (
            <div key={suggestion.name}>
              <button
                className="suggestion-item text-left"
                onClick={() => setExpandedSuggestion(
                  expandedSuggestion === suggestion.name ? null : suggestion.name
                )}
              >
                <p className="text-sm">{suggestion.name}</p>
                {expandedSuggestion === suggestion.name && (
                  <div className="p-2 mt-1 text-left note-divider">
                    <p className="text-xs mb-1">
                      {suggestion.native ? "Native" : "Introduced"}
                    </p>
                    {suggestion.characteristics.map((char, idx) => (
                      <p key={idx} className="text-sm">- {char}</p>
                    ))}
                    {suggestion.key_details.map((keyDetail, idx) => (
                      <p key={idx} className="text-sm">- {keyDetail}</p>
                    ))}
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuggestionChips;

