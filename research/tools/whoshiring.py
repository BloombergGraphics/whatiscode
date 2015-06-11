import feedparser
import igraph

# This is rough iterative code but it pull the most recent 2000 jobs
# from StackOverflow and checks the tags and does some stuff. Used
# for a few parts of the article to back up some conclusions.

url = "http://careers.stackoverflow.com/jobs/feed?tags="
localfile = r'feed.xml'

class Company:
    name = ""
    tags = set()

    def __init__(self, name, tags):
        self.name = name
        self.tags = set(tags)

    def to_html(self):
        s = "<b>%s</b>: %s" % (self.name, ", ".join(sorted(self.tags)))
        return s.encode('utf-8')

    def invert(self):
        return [{'tag':tag, 'name':self.name} for tag in self.tags]
    
    def to_tsv(self):
        return "".join(["%s\t%s\n" % (self.name, tag) for tag in self.tags])

def feedtocolist(tag):
    companies = {}
    u = url + tag
    d = feedparser.parse(url)
    for entry in d.entries:
        tags = []
        try:
            tags=[x.term for x in entry.tags]
        except AttributeError:
            pass
        if entry.author in companies:
            companies[entry.author].tags = companies[entry.author].tags.union(tags)
        else:
            companies[entry.author] = Company(entry.author, tags)
    return companies

def feed_to_tags():
    tags = []
    d = feedparser.parse(url)
    for entry in d.entries:
        try:
            tags.extend([x.term for x in entry.tags])
        except AttributeError:
            pass
    return tags

wanted_cos = set(['Citi', 'Amazon', 'Bloomberg LP', 'Careerbuilder', 'Salesforce', 'comScore', 'PayPal', 'Apple', 'iHerb', 'Slate Magazine', 'TomTom', 'Gap Inc.', 'TD Ameritrade', 'Wikimedia Foundation', 'Pivotal Tracker', 'Ask.fm', 'Gawker Media Group', 'Intel Corporation', 'Philips', 'New Relic', 'Microsoft', 'Braintree', 'Seattle Mariners', 'Spiceworks', 'Crynchyroll'])
wanted_langs = set(['java','c++','objective-c','c','python','ruby','php','javascript','perl'])

def cos_with_tags():
    co_list = feedtocolist('java')
    for co in co_list:
        print co_list[co].to_html()
    tags = {}

def just_tags():
    for tag in feed_to_tags():
        print tag
        
def __main__():
    # cos_with_tags(co_list)
    just_tags()

    tags = {}
    # for k in l:
    #     co = l[k]
    #     invs = co.invert()
    #     for inv in invs:
    #         t = inv['tag']
    #         n = inv['name']
    #         if t in tags:
    #             tags[t] = tags[t].union([n])
    #         else:
    #             tags[t] = set()
    #             tags[t].union([n])
    # for t in tags:
    #     for co in tags[t]:
    #         if co in wanted_cos:
    #             s = ("%s") % (co)
    #             print s.encode('utf-8'),
    #             s = ", ".join(tags[t])

__main__()
