import { Suggestion } from "@/types/suggestions";
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import Spinner from "@/components/common/Spinner";

interface SuggestionsDrawerProps {
  suggestions: Suggestion[];
  isOpen: boolean;
  isLoading: boolean;
  canSuggest: boolean;
  suggestionsToggle: () => void;
}

export const SuggestionsDrawer: React.FC<SuggestionsDrawerProps> = ({ 
  suggestions, 
  isOpen, 
  isLoading,
  canSuggest,
  suggestionsToggle 
}) => {
  const renderTextWithBold = (text: string) => {
    const parts = text.split(/(<[^>]+>)/g);
    return parts.map((part, index) => {
      if (part.startsWith('<') && part.endsWith('>')) {
        const boldText = part.slice(1, -1);
        return <h5 key={index} className="font-bold inline">{boldText}</h5>;
      }
      return part;
    });
  };
  return (
    <>
      {/* Toggle button */}
      {canSuggest && (
        <button
          type="button"
          className={`suggestions-tab-toggle suggestions ${isOpen ? 'drawer-open' : ''}`}
          onClick={suggestionsToggle}
        >
          {isLoading ? <Spinner /> : <TipsAndUpdatesIcon />}
        </button>
      )}
      
      {/* Drawer */}
      <div className={`suggestions-drawer ${isOpen ? "open" : "closed"}`}>
      <div className="suggestions-content-wrapper">
        <div className="suggestions-content">
          {Array.isArray(suggestions) && suggestions.length > 0 && (
            <ul className="space-y-3">
              {suggestions.map((suggestion, idx) => (
                <li key={`${suggestion.name}-${idx}`} className="rounded border p-3">
                  <h4>{suggestion.name}</h4>
                  <div className="opacity-70">{suggestion.native ? "Native" : "Introduced"}</div>
                  {suggestion.characteristics?.length ? (
                    <div className="mt-2 list-disc">
                      {suggestion.characteristics.map((characteristic, idx) => (
                        <>
                          <div key={idx}>{renderTextWithBold(characteristic)}</div>
                          <br key={idx} />
                        </>
                      ))}
                    </div>
                  ) : null}
                  {suggestion.key_details?.length ? (
                    <div className="mt-2 list-disc">
                      {suggestion.key_details.map((keyDetail, idx) => (
                        <>
                          <div key={`${idx}-${keyDetail}`}>{renderTextWithBold(keyDetail)}</div>
                          <br key={`${idx}-${keyDetail}`} />

                        </>
                      ))}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default SuggestionsDrawer;

