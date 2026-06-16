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
        const response = await fetch(`${this.ragBaseUrl}/design/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:4200'
            },
            body: JSON.stringify({
                question: keyword,
                component: null,
                section: null,
                doc_type: null,
                top_k: 8,
                output_format: 'json'
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    // Example of using the response
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

// Usage example in JavaScript/TypeScript
export async function exampleUsage() {
    const designService = new DesignSystemService('http://localhost:8000');
    
    try {
        const result = await designService.searchDesignSystem('gutter spacing icons');
        
        console.log('Search Result:', result);
        console.log('Source:', result.source);
        console.log('URL:', result.url);
        console.log('Category:', result.category);
        console.log('Tags:', result.tags);
        
        // Format for display
        const formatted = designService.formatSearchResult(result);
        console.log('Formatted:', formatted);
        
    } catch (error) {
        console.error('Search failed:', error);
    }
}

// Expected response structure for documentation
export const expectedResponse: RAGQueryResponse = {
    title: 'Design System: spacing',
    description: 'The gutter spacing for icons in masthead is 12px...',
    url: 'content/product-icons/ui-icon-replacement.md',
    category: 'spacing',
    tags: ['spacing', 'ui-icon-replacement'],
    source: 'content/product-icons/ui-icon-replacement.md',
    metadata: {
        detected_component: 'spacing',
        sources: ['content/product-icons/ui-icon-replacement.md'],
        sections: ['Desktop Applications'],
        all_metadata: [
            {
                component: 'ui-icon-replacement',
                section: 'Desktop Applications',
                source: 'content/product-icons/ui-icon-replacement.md'
            }
        ]
    }
};
