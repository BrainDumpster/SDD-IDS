// TypeScript interfaces for website integration

export interface RAGQueryRequest {
    question: string;
    component: string | null;
    section: string | null;
    doc_type: string | null;
    top_k: number;
    output_format: 'standard' | 'json';
}

export interface RAGQueryResponse {
    title: string;
    description: string;
    url: string | null;
    category: string | null;
    tags: string[];
    source: string | null;
    metadata: {
        detected_component: string | null;
        sources: string[];
        sections: string[];
        all_metadata: Array<{
            component?: string;
            section?: string;
            source?: string;
            [key: string]: any;
        }>;
    };
}

// Website service usage example
export class DesignSystemService {
    private ragBaseUrl: string;

    constructor(ragBaseUrl: string) {
        this.ragBaseUrl = ragBaseUrl;
    }

    async searchDesignSystem(keyword: string): Promise<RAGQueryResponse> {
        const response: AxiosResponse<RAGQueryResponse> = await axios.post(
            `${this.ragBaseUrl}/design/query`,
            {
                question: keyword,
                component: null,
                section: null,
                doc_type: null,
                top_k: 8,
                output_format: 'json'
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': 'http://localhost:4200'
                },
                timeout: 30000 // 30 seconds timeout
            }
        );

        return response.data;
    }

    // Example of using the response in a React component
    formatSearchResult(response: RAGQueryResponse) {
        return {
            title: response.title,
            description: response.description,
            url: response.url,
            source: response.source,
            category: response.category,
            tags: response.tags,
            // Additional metadata if needed
            allSources: response.metadata.sources,
            sections: response.metadata.sections
        };
    }
}

// React component example
export interface SearchResultProps {
    query: string;
}

export const SearchResult: React.FC<SearchResultProps> = ({ query }) => {
    const [result, setResult] = useState<RAGQueryResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const designService = new DesignSystemService('http://localhost:8000');

    useEffect(() => {
        const search = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const response = await designService.searchDesignSystem(query);
                setResult(response);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Search failed');
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            search();
        }
    }, [query]);

    if (loading) return <div>Searching...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!result) return <div>No results</div>;

    return (
        <div className="search-result">
            <h3>{result.title}</h3>
            <p>{result.description}</p>
            
            {/* Source information */}
            {result.source && (
                <div className="source-info">
                    <span>Source: {result.source}</span>
                    <a href={result.url} target="_blank" rel="noopener noreferrer">
                        View Documentation
                    </a>
                </div>
            )}
            
            {/* Tags */}
            <div className="tags">
                {result.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                ))}
            </div>
            
            {/* Category */}
            {result.category && (
                <div className="category">
                    Category: {result.category}
                </div>
            )}
        </div>
    );
};
