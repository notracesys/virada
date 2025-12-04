'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Users, KeyRound, Ticket, Activity } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import type { AccessCode, User } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function StatCard({ title, value, icon: Icon, isLoading, description }: { title: string, value: string | number, icon: React.ElementType, isLoading: boolean, description?: string }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <Skeleton className="h-8 w-3/4" />
                ) : (
                    <>
                        <div className="text-2xl font-bold">{value}</div>
                        {description && <p className="text-xs text-muted-foreground">{description}</p>}
                    </>
                )}
            </CardContent>
        </Card>
    );
}

export default function AdminDashboard() {
    const firestore = useFirestore();

    const usersQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'users')) : null, [firestore]);
    const codesQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'access_codes')) : null, [firestore]);

    const { data: users, isLoading: isLoadingUsers } = useCollection<User>(usersQuery);
    const { data: codes, isLoading: isLoadingCodes } = useCollection<AccessCode>(codesQuery);

    const stats = useMemoFirebase(() => {
        if (!codes) return { totalRevenue: 0, codesGenerated: 0, codesUsed: 0 };
        const usedCodes = codes.filter(c => c.isUsed);
        return {
            totalRevenue: (usedCodes.length * 14.90),
            codesGenerated: codes.length,
            codesUsed: usedCodes.length,
        }
    }, [codes]);

    const recentGenerations = useMemoFirebase(() => {
        if (!codes) return [];
        return codes
            .filter(c => c.isUsed && c.usedAt)
            // @ts-ignore - usedAt can be a timestamp, we convert to date for sorting
            .sort((a, b) => new Date(b.usedAt) - new Date(a.usedAt))
            .slice(0, 5);
    }, [codes]);


    const isLoading = isLoadingUsers || isLoadingCodes;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-headline text-foreground flex items-center gap-2">
                <Activity className="w-8 h-8" />
                Dashboard
            </h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                    title="Receita Total" 
                    value={stats.totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    icon={DollarSign}
                    isLoading={isLoading}
                    description={`${stats.codesUsed} vendas`}
                />
                <StatCard 
                    title="Usuários Cadastrados" 
                    value={users?.length ?? 0}
                    icon={Users}
                    isLoading={isLoading}
                />
                <StatCard 
                    title="Códigos Gerados" 
                    value={stats.codesGenerated}
                    icon={KeyRound}
                    isLoading={isLoading}
                />
                <StatCard 
                    title="Códigos Utilizados" 
                    value={stats.codesUsed}
                    icon={Ticket}
                    isLoading={isLoading}
                    description={`${((stats.codesUsed / (stats.codesGenerated || 1)) * 100).toFixed(1)}% de conversão`}
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Gerações Recentes</CardTitle>
                    <CardDescription>As últimas 5 utilizações de códigos de acesso.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>E-mail do Cliente</TableHead>
                                <TableHead>Números Gerados</TableHead>
                                <TableHead>Data/Hora</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    </TableRow>
                                ))
                            ) : recentGenerations.length > 0 ? (
                                recentGenerations.map((gen) => (
                                    <TableRow key={gen.id}>
                                        <TableCell className="font-medium">{gen.email}</TableCell>
                                        <TableCell className="font-mono text-sm">{gen.generatedNumbers?.join(' - ')}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {/* @ts-ignore */}
                                            {gen.usedAt ? format(new Date(gen.usedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : 'N/A'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center h-24">Nenhuma geração encontrada.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}