import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatedBackground } from "@/components/animated-background";
import { Logo } from "@/components/logo";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 bg-background">
        <AnimatedBackground />
        <Card className="w-full max-w-sm z-10 bg-card border">
            <CardHeader className="text-center space-y-4">
                <Logo className="w-20 h-20 mx-auto" />
                <CardTitle className="font-headline text-2xl text-primary">Acesso Restrito</CardTitle>
                <CardDescription>Painel Administrativo - Apenas para autorizados.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="username">ID de Acesso</Label>
                    <Input id="username" type="text" placeholder="user@email.com" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Chave de Segurança</Label>
                    <Input id="password" type="password" placeholder="************" />
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Autenticar</Button>
            </CardFooter>
        </Card>
    </div>
  );
}
