# Just testing to make sure that slash-indentation works for the
# copy desk; it's hard to insert code into a double-columned
# magazine.

def gcd(u, v):
    return gcd(v, u % v) if v \
    else abs(u)

print gcd(16,12)
# expecting 4
