import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useUser } from '@clerk/nextjs';
import { templateData } from '@/app/(main)/(pages)/dashboard/_components/TemplatesSection';

export interface Connection {
    id: string;
    name: string;
    type: string;
    connection_details?: any;
    prompt_helper: any;
    selectedTables: string[];
    icon: string[];
    created_at: string;
}

export const useConnections = () => {
    const [connections, setConnections] = useState<Connection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useUser();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const getIconForType = (type: string): string[] => {
        const template = templateData.find(item => item.title.toLowerCase() === type.toLowerCase());

        return template?.icons || ['database.svg'];
    };

    const getTableNames = (promptHelper: any): string[] => {
        if (!promptHelper) return [];

        try {
            const parsedPromptHelper = typeof promptHelper === 'string' ? JSON.parse(promptHelper) : promptHelper;

            if (Array.isArray(parsedPromptHelper.selectedTables)) {
                return parsedPromptHelper.selectedTables.map((table: any) => table.name);
            }

            return [];
        } catch (error) {
            console.error('Error parsing prompt_helper:', error);
            return [];
        }
    };

    useEffect(() => {
        const fetchConnections = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const { data, error } = await supabase
                    .from('connections')
                    .select('*')
                    .eq('user_id', user.id);

                if (error) {
                    throw error;
                }

                if (data) {
                    const formattedConnections = data.map(conn => ({
                        id: conn.id,
                        name: conn.connection_name,
                        type: conn.connection_type,
                        prompt_helper: conn.prompt_helper,
                        selectedTables: getTableNames(conn.prompt_helper),
                        icon: getIconForType(conn.connection_type),
                        created_at: conn.created_at
                    }));

                    setConnections(formattedConnections);
                }
            } catch (err) {
                console.error('Error fetching connections:', err);
                setError('Failed to load connections');
            } finally {
                setIsLoading(false);
            }
        };

        fetchConnections();
    }, [user]);

    return { connections, isLoading, error };
};