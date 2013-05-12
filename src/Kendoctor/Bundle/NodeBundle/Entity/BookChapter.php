<?php

namespace Kendoctor\Bundle\NodeBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * BookChapter
 *
 * @ORM\Table()
 * @ORM\Entity
 */
class BookChapter
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;


    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }
}
