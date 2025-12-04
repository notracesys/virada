'use client';

import { Ticket } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { AccessCode } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import React from "react";

function GenerationsTable({ generations, isLoading }: { generations: AccessCode[] | null, isLoading: boolean }) {
    if (isLoading) {
        return (
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-2">
                        <Skeleton className="h-4 flex-grow" />
                        <Skeleton className="h-4 flex-grow" />
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                ))}
            </div>
        );
    }

    if (!generations || generations.length === 0) {
        return <p className="text-center text-muted-foreground py-8">Nenhuma geração de números foi realizada ainda.</p>
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Código Utilizado</TableHead>
                    <TableHead>Números Gerados</TableHead>
                    <TableHead>Data da Geração</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {generations.map((gen) => (
                    <TableRow key={gen.id}>
                        <TableCell>{gen.email}</TableCell>
                        <TableCell className="font-mono">{gen.id}</TableCell>
                        <TableCell>
                            <div className="flex flex-wrap gap-2">
                                {gen.generatedNumbers?.map(num => (
                                    <Badge key={num} variant="secondary" className="text-base">
                                        {num.toString().padStart(2, '0')}
                                    </Badge>
                                ))}
                            </div>
                        </TableCell>
                        <TableCell>{gen.usedAt}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default function AdminGenerationsPage() {
    const firestore = useFirestore();

    // Query for all access codes, ordering by creation date as a fallback.
    const allCodesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, 'access_codes'), 
            orderBy('createdAt', 'desc')
        );
    }, [firestore]);

    const { data: rawCodes, isLoading } = useCollection(allCodesQuery);

    const generations: AccessCode[] | null = React.useMemo(() => {
        if (!rawCodes) return null;

        // Filter and sort on the client-side
        const usedCodes = rawCodes.filter(doc => doc.isUsed === true);
        
        // Sort by usedAt date, descending
        usedCodes.sort((a, b) => {
            // @ts-ignore
            const dateA = a.usedAt?.toDate ? a.usedAt.toDate().getTime() : 0;
            // @ts-ignore
            const dateB = b.usedAt?.toDate ? b.usedAt.toDate().getTime() : 0;
            return dateB - dateA;
        });

        return usedCodes.map(doc => ({
            id: doc.id,
            email: doc.email,
            isUsed: doc.isUsed,
            generatedNumbers: doc.generatedNumbers,
            // @ts-ignore
            createdAt: doc.createdAt?.toDate ? format(doc.createdAt.toDate(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : 'N/A',
            // @ts-ignore
            usedAt: doc.usedAt?.toDate ? format(doc.usedAt.toDate(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : 'N/A',
        }));
    }, [rawCodes]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-headline text-foreground flex items-center gap-2">
                <Ticket className="w-8 h-8" />
                Histórico de Gerações
            </h1>

            <Card>
                <CardHeader>
                    <CardTitle>Gerações Realizadas</CardTitle>
                    <CardDescription>Lista de todos os números gerados para os clientes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <GenerationsTable generations={generations} isLoading={isLoading} />
                </CardContent>
            </Card>
        </div>
    );
}
