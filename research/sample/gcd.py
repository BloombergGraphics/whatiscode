#From Rosetta Code
def gcd(u, v):
    return gcd(v, u % v) if v else abs(u)
print gcd(2750, 3750)
