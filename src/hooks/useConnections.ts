import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useUser } from '@clerk/nextjs';
import { templateData } from '@/app/(main)/(pages)/dashboard/_components/TemplatesSection';
import { supabase } from '@/lib/services/connectionService';

export interface Connection {
    id: string;
    name: string;
    type: string;
    userId?: string
    connectionDetails?: any;
    promptHelper: any;
    selectedTables?: string[];
    tableDescriptions?: Record<string, string>;
    icon?: string[];
    createdAt: string;
}

export const useConnections = () => {
    const [connections, setConnections] = useState<Connection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useUser();

    const getTemplateTitle = (value: string) => {
        const template = templateData.find(item => item.value === value);
        return template ? template.title : "Unknown Template";
      };
      

    const getIconForType = (type: string): string[] => {
        const template = templateData.find(item => item.value === type);
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
    
    const getTableDescriptions = (promptHelper: any): Record<string, string> => {
        if (!promptHelper) return {};
        
        try {
            const parsedPromptHelper = typeof promptHelper === 'string' ? JSON.parse(promptHelper) : promptHelper;
            
            if (Array.isArray(parsedPromptHelper.selectedTables)) {
                const descriptions: Record<string, string> = {};
                
                parsedPromptHelper.selectedTables.forEach((table: any) => {
                    if (table.name && table.description) {
                        descriptions[table.name] = table.description;
                    }
                });
                
                return descriptions;
            }
            
            return {};
        } catch (error) {
            console.error('Error parsing table descriptions from promptHelper:', error);
            return {};
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
                        connectionDetails: conn.connection_details,
                        promptHelper: conn.prompt_helper,
                        selectedTables: getTableNames(conn.prompt_helper),
                        tableDescriptions: getTableDescriptions(conn.prompt_helper),
                        icon: getIconForType(conn.connection_type),
                        createdAt: conn.created_at
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

    return { connections, isLoading, error, getTemplateTitle };
};