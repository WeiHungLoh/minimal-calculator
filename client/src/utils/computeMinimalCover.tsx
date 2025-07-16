// Steps to compute taken from https://dev.to/hebashakeel/minimal-cover-417l
interface FD {
  left: string[],
  right: string
}

interface unsplitFD {
  left: string[],
  right: string[]
}

const computeMinimalCover = (fds: unsplitFD[]): FD[] => {

  // Step 1: Split RHS (e.g. A -> B, C will split into A -> B and A -> C)
  const splitRHS = (fds: unsplitFD[]): FD[] => {
    const result: FD[] = []

    for (const fd of fds) {
      for (const RHS of fd.right) {
        result.push({ left: [...fd.left], right: RHS })
      }
    }
    return result
  }

  // Compute closure for a particular FD inside a relation
  const computeClosure = (attributes: string[], fds: FD[]): Set<string> => {
    const closure = new Set(attributes)
    let hasClosureIncreased = true

    // Only loop through every FD once again if closure has been updated to look out for LHS that matches
    while (hasClosureIncreased) {
      hasClosureIncreased = false

      for (const fd of fds) {
        let isLHSPartOfClosure = true

        for (const attr of fd.left) {
          // Every LHS in a FD must be in closure for us to add RHS to closure
          // E.g. Compute closure of A given relation A -> B, A,B -> D. 
          // Closure will be [A,B] in first while loop and [A,B,D] in second
          if (!closure.has(attr)) {
            isLHSPartOfClosure = false  
            break
          }
        }

        if (isLHSPartOfClosure && !closure.has(fd.right)) {
          // Only add RHS if LHS matches and RHS has not been added to closure yet
          closure.add(fd.right)
          hasClosureIncreased = true
        }
      }
    }

    return closure
  }

  // Step 2: Remove redundant FDs
  const removeRedundantFDs = (fds: FD[]): FD[] =>
    fds.filter((fd, i) => {
      // Loops through every FD then for that single FD, compute closure using the remaining FD
      const excludeCurrentFD = fds.filter((_, j) => j !== i)
      const closure = computeClosure(fd.left, excludeCurrentFD)
      // If RHS is inside closure, we shall exclude it since it can be determined using other FDs
      return !closure.has(fd.right)
    })

  // Step 3: Remove extra attributes in LHS
const removeExtraneousFromLHS = (fds: FD[]): FD[] =>
    fds.map(fd => {
      let lhs = [...fd.left]
      
      let changed = true
      while (changed) {
        changed = false
      
        for (let i = 0; i < lhs.length; i++) {
          // Removes one attribute from LHS
          const withoutAttr = lhs.filter((_, j) => j !== i)
          
          // To remove LHS from being reduced to length 0
          if (withoutAttr.length === 0) continue

          // Clones the original FD and replaces the affected FD with a smaller LHS
          const testFDs = fds.map(f => f === fd ? { left: withoutAttr, right: fd.right } : f)
          const closure = computeClosure(withoutAttr, testFDs)
          // If we are able to derive RHS after removing LHS, we shall remove that attribute from LHS
          if (closure.has(fd.right)) {
            lhs = withoutAttr
            changed = true
            break
          }
        }
      }
      
      return { left: lhs, right: fd.right }
    })

  const step1 = splitRHS(fds)
  const step2 = removeRedundantFDs(step1)
  const step3 = removeExtraneousFromLHS(step2)
  return step3
}

export default computeMinimalCover