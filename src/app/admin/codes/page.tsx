'use client';

import { KeyRound } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { AccessCode } from "@/types";
import { GenerateCodeForm } from "./components/generate-code-form";
import { Skeleton } from "@/components/ui/skeleton";

function CodesTable({ codes, isLoading }: { codes: AccessCode[] | null, isLoading: boolean }) {
    if (isLoading) {
        return (
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-2">
                        <Skeleton className="h-4 flex-grow" />
                        <Skeleton className="h-4 flex-grow" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                ))}
            </div>
        );
    }

    if (!codes || codes.length === 0) {
        return <p className="text-center text-muted-foreground py-8">Nenhum código encontrado.</p>
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado em</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {codes.map((code) => (
                    <TableRow key={code.id}>
                        <TableCell className="font-mono">{code.id}</TableCell>
                        <TableCell>{code.email}</TableCell>
                        <TableCell>
                            <Badge variant={code.isUsed ? 'destructive' : 'default'}>
                                {code.isUsed ? 'Usado' : 'Disponível'}
                            </Badge>
                        </TableCell>
                        <TableCell>{code.createdAt}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default function AdminCodesPage() {
    const firestore = useFirestore();

    const codesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'access_codes'), orderBy('createdAt', 'desc'));
    }, [firestore]);

    const { data: rawCodes, isLoading } = useCollection(codesQuery);

    const codes: AccessCode[] | null = useMemoFirebase(() => {
        if (!rawCodes) return null;
        return rawCodes.map(doc => ({
            id: doc.codeId,
            email: doc.email,
            isUsed: doc.isUsed,
            // @ts-ignore
            createdAt: doc.createdAt?.toDate ? format(doc.createdAt.toDate(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : 'N/A',
            // @ts-ignore
            usedAt: doc.usedAt?.toDate ? format(doc.usedAt.toDate(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : null,
            generatedNumbers: doc.generatedNumbers,
        }));
    }, [rawCodes]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-headline text-foreground flex items-center gap-2">
                <KeyRound className="w-8 h-8" />
                Gerenciar Códigos de Acesso
            </h1>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Gerar Novo Código</CardTitle>
                        <CardDescription>Insira o e-mail do cliente para criar um novo código de acesso único.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <GenerateCodeForm />
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Códigos Gerados</CardTitle>
                        <CardDescription>Lista de todos os códigos de acesso criados.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CodesTable codes={codes} isLoading={isLoading} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
