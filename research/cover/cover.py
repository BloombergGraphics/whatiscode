# This is the code from the cover of the magazine.
# Versions at https://gist.github.com/ftrain/45e1984902106bdd2c7a

import datetime

class Issue():
    """TODO write docs here"""

    def __init__(self, **kwargs):
        # TODO: Validate input
        self.__dict__.update(kwargs)
    def publish(self):
        return ('This is the {0.pubdate:%B %d, %Y} issue of {0.title}. ' +
                'It is {0.pages:,} pages long, and ' +
                'costs ${0.price:.5}. '
                'It is about {0.subject}.').format(self)

if __name__ == '__main__':
    bbw = Issue(title='Bloomberg Businessweek',
                price=5.99,
                # That price is only USD;
                # TODO figure out international pricing/currencies
                pages=112,
                pubdate=datetime.datetime(2015, 6, 15),
                subject="code")
    print(bbw.publish())
