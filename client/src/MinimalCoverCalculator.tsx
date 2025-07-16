import { useState } from 'react'
import computeMinimalCover from './utils/computeMinimalCover'

const MinimalCoverCalculator = () => {
    const [functionalDependencies, setFunctionalDependencies] = useState('')
    const [minimalCover, setMinimalCover] = useState<FD[]>([])

    const isMinimalCoverPresent = () => {
        return minimalCover.length > 0
    }

    interface FD {
        left: string[],
        right: string
    }

    const handleCompute = (inputFds: string): void => {
        // Splits input into an array and removes additional space/blank line
        let fds = inputFds.split('\n').map(line => line.trim()).filter(line => line.length > 0)
        const result = []

        for (const fd of fds) {
            if (!fd.includes('->')) {
                alert(`Invalid FD detected: "${fd}". Use the format LHS->RHS`);
                return;
            }
            // Splits functional dependencies into LHS and RHS
            const [LHS, RHS] = fd.split('->')

            // Trims space next to comma before it splits
            const left = LHS.trim().split(',').map(attr => attr.trim());
            const right = RHS.trim().split(',').map(attr => attr.trim());

            result.push({ left, right });
        }

        setMinimalCover(computeMinimalCover(result))
    }

    return (
        <div className='minimal-cover'>
            <h1>Minimal Cover Calculator</h1>
            <p><strong>How to use?</strong></p>
            <p>1) Type one functional dependency per line</p>
            <p>2) Use the format: <code>{'A->B'}</code> or <code>{'A,B->C,D'}</code></p>
            <p>3) Extra space between an attribute and a comma will be automatically trimmed</p>
            <p>4) Do not enter incomplete inputs like <code>A</code> or <code>{'->'}</code></p>

            <textarea
                value={functionalDependencies}
                onChange={e => setFunctionalDependencies(e.target.value)}
                required
                placeholder='Write here'
            />
            <button onClick={() => handleCompute(functionalDependencies)}>Compute Minimal Cover</button>

            {isMinimalCoverPresent() &&
                <div className='result-group'>
                    <h1>Your computed minimal cover is:</h1>
                    {minimalCover.map(m =>
                        <div className='result'>
                            {m.left} {'->'} {m.right}
                        </div>
                    )}
                </div>
            }
        </div>
    )
}

export default MinimalCoverCalculator