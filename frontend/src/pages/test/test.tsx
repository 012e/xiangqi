import {Button} from '@/components/ui/button.tsx';
import {useEffect, useState} from 'react';
import NewGame from '../play/new-game.tsx';
import SelfPlayBoard from '../play/self-playboard.tsx';
import {useAuth0} from '@auth0/auth0-react';

export default function Demo() {
    const {isAuthenticated, isLoading, getAccessTokenSilently} = useAuth0();
    const [player, setPlayer] = useState<'white' | 'black'>('white');

    function togglePlayer() {
        setPlayer((prev) => (prev === 'white' ? 'black' : 'white'));
    }

    useEffect(() => {
        if (isAuthenticated) {
            getAccessTokenSilently().then((token) => {
                localStorage.setItem('access_token', token);
            });
        }
    }, [isAuthenticated, getAccessTokenSilently]);

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    return (
        <div className="w-screen bg-background text-foreground">
            <div className="flex flex-col gap-10 justify-center items-center p-20">
                <div className="flex justify-center items-center w-full h-full">
                    {isAuthenticated && <NewGame/>}
                </div>
                <div className="flex flex-col gap-5 items-center w-full h-full">
                    <div>
                        <Button onClick={togglePlayer}>Change color</Button>
                    </div>
                    <div className="w-1/2 h-1/2">
                        <SelfPlayBoard boardOrientation={player}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
