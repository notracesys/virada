import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatedBackground } from "@/components/animated-background";
import { Logo } from "@/components/logo";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
        <AnimatedBackground />
        <Card className="w-full max-w-sm z-10 bg-black/70 backdrop-blur-sm border-accent/50">
            <CardHeader className="text-center space-y-4">
                <Logo className="w-20 h-20 mx-auto" />
                <CardTitle className="font-headline text-2xl text-accent">Acesso Restrito</CardTitle>
                <CardDescription>Painel Administrativo - Apenas para autorizados.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="username" className="text-primary">ID de Acesso</Label>
                    <Input id="username" type="text" placeholder="user@hack.net" className="bg-transparent text-primary placeholder:text-muted-foreground" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Chave de Segurança</Label>
                    <Input id="password" type="password" placeholder="************" className="bg-transparent text-primary placeholder:text-muted-foreground" />
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Autenticar</Button>
            </CardFooter>
        </Card>
    </div>
  );
}
