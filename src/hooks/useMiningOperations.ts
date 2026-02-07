import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { MiningOperation } from "@/types/lca";
import { mockMiningOperations } from "@/lib/mockData";

const STORAGE_KEY = "terralens_mining_operations";

// Get operations from localStorage
function getStoredOperations(): MiningOperation[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

// Save operations to localStorage
function saveOperations(operations: MiningOperation[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(operations));
    } catch (error) {
        console.error("Failed to save operations:", error);
    }
}

export function useMiningOperations() {
    return useQuery({
        queryKey: ["mining_operations"],
        queryFn: async () => {
            const userOperations = getStoredOperations();
            // Merge user operations with mock data
            return [...userOperations, ...mockMiningOperations];
        },
    });
}

export function useCreateMiningOperation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (operation: Partial<MiningOperation>) => {
            const userOperations = getStoredOperations();

            const newOperation: MiningOperation = {
                id: `user-${Date.now()}`,
                name: operation.name!,
                location: operation.location!,
                type: operation.type!,
                primaryOre: operation.primaryOre!,
                annualProduction: operation.annualProduction || 0,
                operationalSince: operation.operationalSince!,
                employees: operation.employees || 0,
            };

            const updated = [newOperation, ...userOperations];
            saveOperations(updated);

            return newOperation;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mining_operations"] });
        },
    });
}

export function useUpdateMiningOperation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (operation: Partial<MiningOperation> & { id: string }) => {
            const userOperations = getStoredOperations();
            const { id, ...updates } = operation;

            const index = userOperations.findIndex(op => op.id === id);
            if (index === -1) {
                throw new Error("Operation not found");
            }

            userOperations[index] = {
                ...userOperations[index],
                ...updates,
            } as MiningOperation;

            saveOperations(userOperations);
            return userOperations[index];
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mining_operations"] });
        },
    });
}

export function useDeleteMiningOperation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (operationId: string) => {
            const userOperations = getStoredOperations();
            const filtered = userOperations.filter(op => op.id !== operationId);
            saveOperations(filtered);
            return operationId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mining_operations"] });
        },
    });
}
